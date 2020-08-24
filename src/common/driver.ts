import {ClientOptions, ControllerClient} from "./client";

export enum DriverType {
    Admission = "admission",
    PaymentTerminal = "payment-terminal",
    NfcReader = "nfc-reader",
    Locking = "locking",
}

export class Driver extends ControllerClient {
    constructor(type: DriverType, options?: ClientOptions) {
        super(`/drivers/${type}`, options);
    }
}