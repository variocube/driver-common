import {CloseHandler, OpenHandler, VcmpClient} from "@variocube/messaging";

export interface ClientOptions {
    controllerHost: string;
    controllerPort: number;
    autoStart: boolean;
}

export class ControllerClient {

    protected readonly client: VcmpClient;

    constructor(path: string, options?: ClientOptions) {
        const {
            controllerHost = "localhost",
            controllerPort = 9000,
            autoStart = true,
        } = options || {};

        this.client = new VcmpClient(`ws://${controllerHost}:${controllerPort}${path}`, {
            customWebSocket: require("ws"),
            autoStart
        });
    }

    set onOpen(handler: OpenHandler) {
        this.client.onOpen = handler;
    }

    set onClose(handler: CloseHandler) {
        this.client.onClose = handler;
    }

    start() {
        this.client.start();
    }

    stop() {
        this.client.stop();
    }
}