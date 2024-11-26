import {ClientOptions, Driver, DriverType} from "../common";
import {DoorbellMessageTypes, DoorBellRing} from "./messages";

export class DoorBellDriver extends Driver {

    constructor(options?: ClientOptions) {
        super(DriverType.DoorBell, options);
    }

    set onDoorBellRing(handler: (message: DoorBellRing) => Promise<void>) {
        this.client.on(DoorbellMessageTypes.DoorbellRing, handler);
    }

}
