/**
 * This module specifies messages sent from/to a payment terminal service.
 *
 * A payment terminal service can only process one payment at a time. Therefore
 * only specific message flows are permitted. If the payment terminal encounters
 * a message that is not applicable to the current state of a payment, it should
 * not accept it and throw an error instead (respond with a NAK on VCMP level).
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
}

/**
 * Issued by the payment terminal to request displaying the
 * specified message to the customer.
 */
export interface DisplayRequest {
    "@type": PaymentTerminalMessageTypes.DisplayRequest;

    /** The message to display (array of lines) */
    message: string[];
}

/**
 * Issued by the payment terminal when the payment was denied.
 */
export interface PaymentDenied {
    "@type": PaymentTerminalMessageTypes.PaymentDenied;

    /** The reason why the payment was denied */
    reason: string;
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
}

/**
 * Sent to the payment terminal to confirm the payment.
 */
export interface ConfirmPayment {
    "@type": PaymentTerminalMessageTypes.ConfirmPayment;
}

/**
 * Sent to the payment terminal to cancel the payment.
 */
export interface CancelPayment {
    "@type": PaymentTerminalMessageTypes.CancelPayment;
}

export type PaymentTerminalMessage =
    InitiatePayment
    | DisplayRequest
    | PaymentDenied
    | PaymentApproved
    | ConfirmPayment
    | CancelPayment;
