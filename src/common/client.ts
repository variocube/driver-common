import {CloseHandler, ConsoleLike, OpenHandler, VcmpClient} from "@variocube/vcmp";
import NodeWebSocket from "ws";

export interface ClientOptions {
    controllerHost?: string;
    controllerPort?: number;
    autoStart?: boolean;
    debug?: ConsoleLike;
}

export class ControllerClient {

    protected readonly client: VcmpClient;

    constructor(path: string, options?: ClientOptions) {
        const {
            controllerHost = "localhost",
            controllerPort = 9000,
            autoStart = true,
            debug,
        } = options || {};

        this.client = new VcmpClient(`ws://${controllerHost}:${controllerPort}${path}`, {
            customWebSocket: detectWebSocket(),
            autoStart,
            debug
        });
    }

    get connected() {
        return this.client.connected;
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

function detectWebSocket(): typeof WebSocket {
    if (typeof WebSocket !== "undefined") {
        return WebSocket;
    }
    return NodeWebSocket as typeof WebSocket;
}