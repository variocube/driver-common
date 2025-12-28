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
    // that is not compatible with VCMP yet. So we have more exhaustive checks in place.
    //
    // If it has a WebSocket, window and document, assume it's a browser environment
    // and use its WebSocket implementation.
    if (typeof WebSocket !== "undefined" && typeof window !== "undefined" && typeof window.document !== "undefined") {
        return WebSocket;
    }
    // Use NodeWebSocket only if running on Node.js.
    else if (isNode()) {
        return NodeWebSocket;
    }
    throw new Error("WebSocket implementation could not be detected.");
}

function isNode() {
    return typeof process !== "undefined"
        && process.versions != null
        && process.versions.node != null;
}