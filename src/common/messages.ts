/**
 * This module specifies messages issued by a driver to inform
 * about addition and removal of devices as well a message to
 * restart a device.
 */

/**
 * Enum of device message types
 */
export enum DeviceMessageTypes {
    DeviceAdded = "device:DeviceAdded",
    DeviceRemoved = "device:DeviceRemoved",
    RestartDevice = "device:Restart",
}

/**
 * Enum of device types.
 */
export enum DeviceType {
    /** NFC-Reader */
    NfcReader = "NfcReader",

    /** Payment terminal */
    PaymentTerminal = "PaymentTerminal",

    /** Locking device */
    Locking = "Locking",

    /** Admission device */
    Admission = "Admission",

    /** Barcode reader */
    BarcodeReader = "BarcodeReader",

    /** Kiosk */
    Kiosk = "Kiosk",

    /** Keypad */
    Keypad = "Keypad",
}


/**
 * Issued by the driver when a device was added to the system.
 */
export interface DeviceAdded {
    "@type": DeviceMessageTypes.DeviceAdded;

    /**
     * The universally unique id of the device.
     * Good candidates are universally unique hardware IDs like a MAC address, or
     * a unique combination of vendor/model and serial number.
     */
    id: string;

    /** The device's types. */
    types: DeviceType[];

    /** The vendor of the device. */
    vendor: string;

    /** The model of the device. */
    model: string;

    /** The serialNumber of the device. */
    serialNumber: string;

    /** Additional information specific to the device */
    info: any;
}

/**
 * Issued by the driver when a device was removed from the system.
 */
export interface DeviceRemoved {
    "@type": DeviceMessageTypes.DeviceRemoved;

    /** The id of the device that was removed. */
    id: string;
}

/**
 * Sent to the driver to request the restart of a device.
 */
export interface RestartDevice {
    "@type": DeviceMessageTypes.RestartDevice;

    /** The id of the device to be restarted. */
    id: string;
}

export type DeviceMessage =
    DeviceAdded
    | DeviceRemoved
    | RestartDevice;
