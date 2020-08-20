import {ClientOptions, createControllerClient} from "./client";

export enum DriverType {
    Admission = "admission",
    PaymentTerminal = "payment-terminal",
    NfcReader = "nfc-reader",
    Locking = "locking",
}

/**
 * Creates a VCMP client with the correct settings for a driver
 * @param type The type of driver
 * @param options See DriverOptions
 */
export function createDriverClient(type: DriverType, options?: ClientOptions) {
    return createControllerClient(`/drivers/${type}`, options);
}
