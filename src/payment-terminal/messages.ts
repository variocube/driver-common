/**
 * This module specifies messages sent from/to a payment terminal service.
 *
 * A payment terminal service can only process one payment at a time. Therefore
 * only specific message flows are permitted. If the payment terminal encounters
 * a message that is not applicable to the current state of a payment, it should
 * not accept it and throw an error instead (respond with a NAK on VCMP level).
 *
 * A payment may carry a `paymentId` (a UUID string chosen by the sender of `InitiatePayment`). With a
 * `paymentId`, the driver acknowledges `InitiatePayment` once it accepted the payment and reports the outcome
 * as a separate message (`PaymentApproved` or `PaymentDenied`); results and commands are matched to the payment
 * by that id. Without one, the behavior is unchanged. An unknown outcome is reported as `PaymentDenied` with
 * `outcomeUnknown` set.
 *
 * All `paymentId` and `outcomeUnknown` fields are optional: senders omit an absent field rather than sending
 * `null`, and receivers ignore fields they do not know.
 */

/** Enum of payment terminal message types */
export enum PaymentTerminalMessageTypes {
    InitiatePayment = "payment-terminal:InitiatePayment",
    DisplayRequest = "payment-terminal:DisplayRequest",
    PaymentDenied = "payment-terminal:PaymentDenied",
    PaymentApproved = "payment-terminal:PaymentApproved",
    ConfirmPayment = "payment-terminal:ConfirmPayment",
    CancelPayment = "payment-terminal:CancelPayment",
}

/**
 * Sent to a payment terminal to initiate a payment of the specified `amount`
 * in the specified `currency`
 */
export interface InitiatePayment {
    "@type": PaymentTerminalMessageTypes.InitiatePayment;

    /** The amount to pay */
    amount: number;

    /** The currency in which to pay the amount (3-letter currency code) */
    currency: string;

    /** The language for messages from the terminal */
    language: string;

    /** Identifies the payment this message belongs to (UUID); absent for payments without an id */
    paymentId?: string;
}

/**
 * Issued by the payment terminal to request displaying the
 * specified message to the customer.
 */
export interface DisplayRequest {
    "@type": PaymentTerminalMessageTypes.DisplayRequest;

    /** The message to display (array of lines) */
    message: string[];

    /** Identifies the payment this message belongs to (UUID); absent for payments without an id */
    paymentId?: string;
}

/**
 * Issued by the payment terminal when the payment was denied.
 */
export interface PaymentDenied {
    "@type": PaymentTerminalMessageTypes.PaymentDenied;

    /** The reason why the payment was denied */
    reason: string;

    /**
     * When true, the outcome of the payment is unknown: it may have been approved or not, and has to be
     * reconciled. Absent means the payment was definitely denied.
     */
    outcomeUnknown?: boolean;

    /** Identifies the payment this message belongs to (UUID); absent for payments without an id */
    paymentId?: string;
}

/**
 * Issued by the payment terminal when the payment was approved.
 */
export interface PaymentApproved {
    "@type": PaymentTerminalMessageTypes.PaymentApproved;

    /**
     * Receipt text for the customer.
     */
    receiptText: string;

    /**
     * Receipt text for the merchant.
     */
    merchantReceiptText?: string;

    /**
     * Transaction Url of the payment
     */
    merchantTransactionUrl?: string;

    /** Identifies the payment this message belongs to (UUID); absent for payments without an id */
    paymentId?: string;
}

/**
 * Sent to the payment terminal to confirm the payment.
 */
export interface ConfirmPayment {
    "@type": PaymentTerminalMessageTypes.ConfirmPayment;

    /** Identifies the payment this message belongs to (UUID); absent for payments without an id */
    paymentId?: string;
}

/**
 * Sent to the payment terminal to cancel the payment.
 */
export interface CancelPayment {
    "@type": PaymentTerminalMessageTypes.CancelPayment;

    /** Identifies the payment this message belongs to (UUID); absent for payments without an id */
    paymentId?: string;
}

export type PaymentTerminalMessage =
    InitiatePayment
    | DisplayRequest
    | PaymentDenied
    | PaymentApproved
    | ConfirmPayment
    | CancelPayment;
