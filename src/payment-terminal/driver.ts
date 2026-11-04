import {CancelPayment, ConfirmPayment, InitiatePayment, PaymentTerminalMessageTypes} from "./messages";
import {ClientOptions, Driver, DriverType} from "../common";

/** Parameters of a display request */
export interface DisplayRequestParams {
    /** The message to display (array of lines) */
    message: string[];

    /** The payment the request belongs to */
    paymentId?: string;
}

/** Parameters of an approved payment */
export interface PaymentApprovedParams {
    /** Receipt text for the customer */
    receiptText: string;

    /** Receipt text for the merchant */
    merchantReceiptText?: string;

    /** Transaction Url of the payment */
    merchantTransactionUrl?: string;

    /** The payment that was approved */
    paymentId?: string;
}

/** Parameters of a denied payment */
export interface PaymentDeniedParams {
    /** The reason why the payment was denied */
    reason: string;

    /** The payment that was denied */
    paymentId?: string;

    /** True if the outcome of the payment is unknown and has to be reconciled */
    outcomeUnknown?: boolean;
}

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

    async sendDisplayRequest(message: string[]): Promise<void>;
    async sendDisplayRequest(request: DisplayRequestParams): Promise<void>;
    async sendDisplayRequest(arg: string[] | DisplayRequestParams) {
        const {message, paymentId} = Array.isArray(arg) ? {message: arg, paymentId: undefined} : arg;
        await this.client.send({
            "@type": PaymentTerminalMessageTypes.DisplayRequest,
            message,
            ...(paymentId != null && {paymentId})
        });
    }

    async sendPaymentApproved(
        receiptText: string,
        merchantReceiptText?: string,
        merchantTransactionUrl?: string,
    ): Promise<void>;
    async sendPaymentApproved(approval: PaymentApprovedParams): Promise<void>;
    async sendPaymentApproved(
        arg: string | PaymentApprovedParams,
        merchantReceiptText?: string,
        merchantTransactionUrl?: string,
    ) {
        const approval: PaymentApprovedParams = typeof arg === "string"
            ? {receiptText: arg, merchantReceiptText, merchantTransactionUrl}
            : arg;
        await this.client.send({
            "@type": PaymentTerminalMessageTypes.PaymentApproved,
            receiptText: approval.receiptText,
            merchantReceiptText: approval.merchantReceiptText,
            merchantTransactionUrl: approval.merchantTransactionUrl,
            ...(approval.paymentId != null && {paymentId: approval.paymentId})
        });
    }

    async sendPaymentDenied(reason: string): Promise<void>;
    async sendPaymentDenied(denial: PaymentDeniedParams): Promise<void>;
    async sendPaymentDenied(arg: string | PaymentDeniedParams) {
        const denial: PaymentDeniedParams = typeof arg === "string" ? {reason: arg} : arg;
        await this.client.send({
            "@type": PaymentTerminalMessageTypes.PaymentDenied,
            reason: denial.reason,
            ...(denial.outcomeUnknown != null && {outcomeUnknown: denial.outcomeUnknown}),
            ...(denial.paymentId != null && {paymentId: denial.paymentId})
        });
    }
}
