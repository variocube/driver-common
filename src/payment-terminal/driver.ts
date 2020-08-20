import {VcmpClient} from "@variocube/messaging";
import {CancelPayment, ConfirmPayment, InitiatePayment, PaymentTerminalMessageTypes} from "./messages";
import {createDriverClient, ClientOptions, DriverType} from "../common";

export class PaymentTerminalDriver {

    private readonly client:VcmpClient;

    constructor(options?: ClientOptions) {
        this.client = createDriverClient(DriverType.PaymentTerminal, options);
    }

    set onInitiatePayment(handler: (message: InitiatePayment) => Promise<void>) {
        this.client.on(PaymentTerminalMessageTypes.InitiatePayment, handler);
    }

    set onCancelPayment(handler: (message: CancelPayment) => Promise<void>) {
        this.client.on(PaymentTerminalMessageTypes.CancelPayment, handler);
    }

    set onConfirmPayment(handler: (message: ConfirmPayment) => Promise<void>) {
        this.client.on(PaymentTerminalMessageTypes.ConfirmPayment, handler);
    }

    async sendDisplayRequest(message: string[]) {
        await this.client.send({
            "@type": PaymentTerminalMessageTypes.DisplayRequest,
            message
        });
    }

    async sendPaymentApproved(receiptText: string) {
        await this.client.send({
            "@type": PaymentTerminalMessageTypes.PaymentApproved,
            receiptText
        });
    }

    async sendPaymentDenied(reason: string) {
        await this.client.send({
            "@type": PaymentTerminalMessageTypes.PaymentDenied,
            reason
        });
    }
}