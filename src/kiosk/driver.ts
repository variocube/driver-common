import {ClientOptions, Driver, DriverType} from "../common";
import {KioskMessageTypes, Screenshot, TakeScreenshot} from "./messages";

export class KioskDriver extends Driver {

    onTakeScreenshot?: (takeScreenshot: TakeScreenshot) => any;

    constructor(options?: ClientOptions) {
        super(DriverType.Kiosk, options);
        // Discard the callback's result: VCMP would send it to the controller as the ACK payload.
        this.client.on<TakeScreenshot>(KioskMessageTypes.TakeScreenshot, async (m) => {
            await this.onTakeScreenshot?.(m);
        });
    }

    async sendScreenshot(dataUri: string, kioskId: string) {
        await this.client.send<Screenshot>({
            "@type": KioskMessageTypes.Screenshot,
            dataUri,
            kioskId
        });
    }

}