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

function detectWebSocket() {
    // Node.js >=22.4 provides a built-in WebSocket implementation
    // that is not compatible with VCMP yet. Force using NodeWebSocket
    // when running on Node.js.
    if (isNode()) {
        return NodeWebSocket;
    }
    else if (typeof WebSocket !== "undefined") {
        return WebSocket;
    }
    throw new Error("WebSocket is not defined");
}

function isNode() {
    if (typeof module !== 'undefined' && module.exports) {
        return true;
    }
    return (typeof process !== 'undefined') &&
        (process.release.name.search(/node|io.js/) !== -1);
}