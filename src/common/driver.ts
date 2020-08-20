import {VcmpClient} from "@variocube/messaging";

export enum DriverType {
    Admission = "admission",
    PaymentTerminal = "payment-terminal",
    NfcReader = "nfc-reader",
    Locking = "locking",
}

export interface DriverOptions {
    controllerHost: string;
    controllerPort: number;
    autoStart: boolean;
}

/**
 * Creates a VCMP client with the correct settings for a driver
 * @param type The type of driver
 * @param options See DriverOptions
 */
export function createDriverClient(type: DriverType, options?: DriverOptions) {
    const {
        controllerHost = "localhost",
        controllerPort = 9000,
        autoStart = true,
    } = options || {};

    return new VcmpClient(`ws://${controllerHost}:${controllerPort}/drivers/${type}`, {
        customWebSocket: require("ws"),
        autoStart
    });
}
