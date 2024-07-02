import {CancelPayment, ConfirmPayment, InitiatePayment, PaymentTerminalMessageTypes} from "./messages";
import {ClientOptions, Driver, DriverType} from "../common";

export class PaymentTerminalDriver extends Driver {

    constructor(options?: ClientOptions) {
        super(DriverType.PaymentTerminal, options);
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

    async sendPaymentApproved(receiptText: string, merchantReceiptText?: string, merchantTransactionUrl?: string) {
        await this.client.send({
            "@type": PaymentTerminalMessageTypes.PaymentApproved,
            receiptText,
            merchantReceiptText,
            merchantTransactionUrl
        });
    }

    async sendPaymentDenied(reason: string) {
        await this.client.send({
            "@type": PaymentTerminalMessageTypes.PaymentDenied,
            reason
        });
    }
}