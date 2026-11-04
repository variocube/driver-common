import {test} from "node:test";
import assert from "node:assert/strict";
import {AddressInfo} from "node:net";
import {parseVcmpFrame, serializeVcmpFrame, VcmpError} from "@variocube/vcmp";
import WebSocket, {WebSocketServer} from "ws";
import {PaymentTerminalDriver} from "./driver";

/** The server sees the connection slightly before the driver's session is open; retry while it answers 503. */
async function sendWhenOpen(driver: PaymentTerminalDriver, send: (driver: PaymentTerminalDriver) => Promise<void>) {
    for (let attempt = 0;; attempt++) {
        try {
            return await send(driver);
        }
        catch (error) {
            if (!(error instanceof VcmpError && error.status == 503) || attempt >= 50) {
                throw error;
            }
            await new Promise(resolve => setTimeout(resolve, 20));
        }
    }
}

/** Runs a loopback stand-in for the controller that ACKs everything; `run` returns what the driver sent. */
async function sentBy(send: (driver: PaymentTerminalDriver) => Promise<void>): Promise<Record<string, unknown>> {
    const server = new WebSocketServer({host: "127.0.0.1", port: 0});
    await new Promise(resolve => server.once("listening", resolve));
    const connected = new Promise<void>(resolve => server.once("connection", () => resolve()));
    const received = new Promise<Record<string, unknown>>(resolve => {
        server.on("connection", (socket: WebSocket) => {
            socket.on("message", data => {
                const frame = parseVcmpFrame(data.toString());
                if (frame.type == "MSG") {
                    socket.send(serializeVcmpFrame({type: "ACK", id: frame.id}));
                    resolve(JSON.parse(frame.payload ?? "{}"));
                }
            });
        });
    });
    const driver = new PaymentTerminalDriver({
        controllerPort: (server.address() as AddressInfo).port,
        controllerHost: "127.0.0.1",
    });
    try {
        await connected;
        await sendWhenOpen(driver, send);
        return await received;
    }
    finally {
        driver.stop();
        await new Promise(resolve => server.close(resolve));
    }
}

test("positional sendPaymentApproved sends no paymentId and omits absent optional fields", async () => {
    const sent = await sentBy(d => d.sendPaymentApproved("receipt"));
    assert.deepEqual(sent, {"@type": "payment-terminal:PaymentApproved", receiptText: "receipt"});
});

test("positional sendPaymentDenied sends only the reason", async () => {
    const sent = await sentBy(d => d.sendPaymentDenied("declined"));
    assert.deepEqual(sent, {"@type": "payment-terminal:PaymentDenied", reason: "declined"});
});

test("positional sendDisplayRequest sends only the message", async () => {
    const sent = await sentBy(d => d.sendDisplayRequest(["a", "b"]));
    assert.deepEqual(sent, {"@type": "payment-terminal:DisplayRequest", message: ["a", "b"]});
});

test("object sendPaymentApproved sends paymentId and merchant fields", async () => {
    const sent = await sentBy(d =>
        d.sendPaymentApproved({receiptText: "r", merchantReceiptText: "m", merchantTransactionUrl: "u", paymentId: "p"})
    );
    assert.deepEqual(sent, {
        "@type": "payment-terminal:PaymentApproved",
        receiptText: "r",
        merchantReceiptText: "m",
        merchantTransactionUrl: "u",
        paymentId: "p",
    });
});

test("object sendPaymentDenied sends paymentId and outcomeUnknown, and omits them when absent", async () => {
    const full = await sentBy(d => d.sendPaymentDenied({reason: "lost", paymentId: "p", outcomeUnknown: true}));
    assert.deepEqual(full, {
        "@type": "payment-terminal:PaymentDenied",
        reason: "lost",
        paymentId: "p",
        outcomeUnknown: true,
    });
    const bare = await sentBy(d => d.sendPaymentDenied({reason: "no"}));
    assert.deepEqual(bare, {"@type": "payment-terminal:PaymentDenied", reason: "no"});
});

test("object sendDisplayRequest sends paymentId", async () => {
    const sent = await sentBy(d => d.sendDisplayRequest({message: ["x"], paymentId: "p"}));
    assert.deepEqual(sent, {"@type": "payment-terminal:DisplayRequest", message: ["x"], paymentId: "p"});
});

test("null optional fields (e.g. echoed from the controller) are omitted, never sent as null", async () => {
    const nulls = {paymentId: null, outcomeUnknown: null} as unknown as {};
    const denied = await sentBy(d => d.sendPaymentDenied({reason: "no", ...nulls}));
    assert.deepEqual(denied, {"@type": "payment-terminal:PaymentDenied", reason: "no"});
    const approved = await sentBy(d => d.sendPaymentApproved({receiptText: "r", ...nulls}));
    assert.deepEqual(approved, {"@type": "payment-terminal:PaymentApproved", receiptText: "r"});
    const display = await sentBy(d => d.sendDisplayRequest({message: ["x"], ...nulls}));
    assert.deepEqual(display, {"@type": "payment-terminal:DisplayRequest", message: ["x"]});
});
