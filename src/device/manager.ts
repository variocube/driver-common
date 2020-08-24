import {VcmpClient} from "@variocube/messaging";
import {DeviceAdded, DeviceMessageTypes, DeviceRemoved, DeviceType} from "./messages";
import {ClientOptions, createControllerClient} from "../common";

export class DeviceManagerClient {

    protected readonly client: VcmpClient;

    constructor(options?: ClientOptions) {
        this.client = createControllerClient("/devices", options);
    }

    start() {
        this.client.start();
    }

    stop() {
        this.client.stop();
    }

    /**
     * Notifies the controller that a device was added.
     *
     * @param id The universally unique id of the device.
     * @param types The device's types
     * @param vendor The vendor of the device
     * @param model The device model
     * @param info Additional device info
     */
    async sendDeviceAdded(id: string, types: DeviceType[], vendor: string, model: string, info: any) {
        await this.client.send<DeviceAdded>({
            "@type": DeviceMessageTypes.DeviceAdded,
            id,
            types,
            vendor,
            model,
            info
        });
    }

    /**
     * Notifies the controller that a device was removed.
     *
     * @param id The device id.
     */
    async sendDeviceRemoved(id: string) {
        await this.client.send<DeviceRemoved>({
            "@type": DeviceMessageTypes.DeviceRemoved,
            id,
        });
    }
}

