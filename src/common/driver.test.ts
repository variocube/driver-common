import {test} from "node:test";
import assert from "node:assert/strict";
import {AddressInfo} from "node:net";
import {generateVcmpFrameId, parseVcmpFrame, serializeVcmpFrame, VcmpError} from "@variocube/vcmp";
import WebSocket, {WebSocketServer} from "ws";
import {DeviceMessageTypes, DeviceType} from "./messages";
import {Driver, DriverType} from "./driver";
import {KioskDriver, KioskMessageTypes} from "../kiosk";

type Exchange = (message: object) => Promise<ReturnType<typeof parseVcmpFrame>>;

/** Runs a loopback stand-in for the controller; `exchange` sends one message to the driver and returns its answer. */
async function withController(connect: (port: number) => Driver, run: (exchange: Exchange) => Promise<void>) {
    const server = new WebSocketServer({host: "127.0.0.1", port: 0});
    await new Promise(resolve => server.once("listening", resolve));
    const connected = new Promise<WebSocket>(resolve => server.once("connection", resolve));
    const driver = connect((server.address() as AddressInfo).port);
    try {
        const socket = await connected;
        await run(message => new Promise(resolve => {
            socket.once("message", data => resolve(parseVcmpFrame(data.toString())));
            socket.send(serializeVcmpFrame({type: "MSG", id: generateVcmpFrameId(), payload: JSON.stringify(message)}));
        }));
    }
    finally {
        driver.stop();
        await new Promise(resolve => server.close(resolve));
    }
}

test("a send method rejects with VcmpError 503 when there is no controller session", async () => {
    const driver = new Driver(DriverType.Locking, {autoStart: false});
    const sent = driver.sendDeviceAdded({id: "d1", types: [DeviceType.Locking], vendor: "v", model: "m", info: {}});
    await assert.rejects(sent, (error: unknown) => error instanceof VcmpError && error.status == 503);
});

test("the RestartDevice ACK carries no payload, whatever onRestartDevice returns", async () => {
    await withController(port => {
        const driver = new Driver(DriverType.Locking, {controllerPort: port, controllerHost: "127.0.0.1"});
        driver.onRestartDevice = () => ({notFor: "the controller"});
        return driver;
    }, async exchange => {
        const frame = await exchange({"@type": DeviceMessageTypes.RestartDevice, id: "d1"});
        assert.equal(frame.type, "ACK");
        assert.equal(frame.payload, undefined);
    });
});

test("a rejecting onRestartDevice is answered with a NAK carrying its error", async () => {
    await withController(port => {
        const driver = new Driver(DriverType.Locking, {controllerPort: port, controllerHost: "127.0.0.1"});
        driver.onRestartDevice = async () => {
            throw new Error("restart failed");
        };
        return driver;
    }, async exchange => {
        const frame = await exchange({"@type": DeviceMessageTypes.RestartDevice, id: "d1"});
        assert.equal(frame.type, "NAK");
        assert.equal(JSON.parse(frame.payload ?? "{}").detail, "restart failed");
    });
});

test("the TakeScreenshot ACK carries no payload, whatever onTakeScreenshot returns", async () => {
    await withController(port => {
        const driver = new KioskDriver({controllerPort: port, controllerHost: "127.0.0.1"});
        driver.onTakeScreenshot = async () => "data:image/png;base64,AAAA";
        return driver;
    }, async exchange => {
        const frame = await exchange({"@type": KioskMessageTypes.TakeScreenshot, kioskId: "k1", highQuality: false});
        assert.equal(frame.type, "ACK");
        assert.equal(frame.payload, undefined);
    });
});

test("a rejecting onTakeScreenshot is answered with a NAK carrying its error", async () => {
    await withController(port => {
        const driver = new KioskDriver({controllerPort: port, controllerHost: "127.0.0.1"});
        driver.onTakeScreenshot = async () => {
            throw new Error("screenshot failed");
        };
        return driver;
    }, async exchange => {
        const frame = await exchange({"@type": KioskMessageTypes.TakeScreenshot, kioskId: "k1", highQuality: false});
        assert.equal(frame.type, "NAK");
        assert.equal(JSON.parse(frame.payload ?? "{}").detail, "screenshot failed");
    });
});
