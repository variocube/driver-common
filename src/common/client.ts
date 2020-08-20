import {VcmpClient} from "@variocube/messaging";

export interface ClientOptions {
    controllerHost: string;
    controllerPort: number;
    autoStart: boolean;
}

export function createControllerClient(path: string, options?: ClientOptions) {
    const {
        controllerHost = "localhost",
        controllerPort = 9000,
        autoStart = true,
    } = options || {};

    return new VcmpClient(`ws://${controllerHost}:${controllerPort}${path}`, {
        customWebSocket: require("ws"),
        autoStart
    });
}