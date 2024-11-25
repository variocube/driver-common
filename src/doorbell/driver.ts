import {ClientOptions, Driver, DriverType} from "../common";
import { DoorBellMessageTypes, DoorBellRing } from "./messages";

export class DoorBellDriver extends Driver {

    constructor(options?: ClientOptions) {
        super(DriverType.DoorBell, options);
    }

    set onDoorBellRing(handler: (message: DoorBellRing) => Promise<void>) {
        this.client.on(DoorBellMessageTypes.DoorBellRing, handler);
    }

    /**
     * For Requesting ring to a door
     * @param serialNr 
     */
    async sendDoorBellRing(serialNr: string) {
        await this.client.send<DoorBellRing>({
            "@type": DoorBellMessageTypes.DoorBellRing,
             id: serialNr, 
        });
    }

    async sendDoorBellAdded(doorBellId: string) {
        await this.client.send({
            "@type": DoorBellMessageTypes.DoorBellAdded,
            id: doorBellId
        });
    }

    async sendDoorBellRemoved(doorBellId: string) {
        await this.client.send({
            "@type": DoorBellMessageTypes.DoorBellRemoved,
            id: doorBellId
        });
    }
 
}
