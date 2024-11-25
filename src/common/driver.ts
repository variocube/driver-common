import {ClientOptions, ControllerClient} from "./client";
import {Device, DeviceAdded, DeviceMessageTypes, DeviceRemoved, RestartDevice} from "./messages";
import {VcmpHandler} from "@variocube/vcmp";

export enum DriverType {
    Keypad = "keypad",
    PaymentTerminal = "payment-terminal",
    NfcReader = "nfc-reader",
    Locking = "locking",
    BarcodeReader = "barcode-reader",
    Kiosk = "kiosk",
    DoorBell = "door-bell",
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
     * @param device The device that was added.
     */
    async sendDeviceAdded(device: Device) {
        await this.client.send<DeviceAdded>({
            "@type": DeviceMessageTypes.DeviceAdded,
            ...device
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