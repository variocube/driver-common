import {ClientOptions, createControllerClient} from "./client";
import {VcmpClient} from "@variocube/messaging";

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

export class Driver {

    protected readonly client: VcmpClient;

    constructor(type: DriverType, options?: ClientOptions) {
        this.client = createDriverClient(type, options);
    }

    start() {
        this.client.start();
    }

    stop() {
        this.client.stop();
    }
}