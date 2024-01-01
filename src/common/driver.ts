import {ClientOptions, ControllerClient} from "./client";
import {DeviceAdded, DeviceMessageTypes, DeviceRemoved, DeviceType, RestartDevice} from "./messages";
import {VcmpHandler} from "@variocube/vcmp";

export enum DriverType {
    Keypad = "keypad",
    PaymentTerminal = "payment-terminal",
    NfcReader = "nfc-reader",
    Locking = "locking",
    BarcodeReader = "barcode-reader",
    Kiosk = "kiosk",
}

export class Driver extends ControllerClient {

    onRestartDevice?: VcmpHandler<RestartDevice>;

    constructor(type: DriverType, options?: ClientOptions) {
        super(`/drivers/${type}`, options);

        this.client.on<RestartDevice>(DeviceMessageTypes.RestartDevice, (rd, session) => this.onRestartDevice && this.onRestartDevice(rd, session));
    }

    /**
     * Notifies the controller that a device was added.
     *
     * @param id The universally unique id of the device.
     * @param types The device's types
     * @param vendor The vendor of the device
     * @param model The device model
     * @param model The device serialNumber
     * @param info Additional device info
     */
    async sendDeviceAdded(id: string, types: DeviceType[], vendor: string, model: string, serialNumber: string, info: any) {
        await this.client.send<DeviceAdded>({
            "@type": DeviceMessageTypes.DeviceAdded,
            id,
            types,
            vendor,
            model,
            serialNumber,
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