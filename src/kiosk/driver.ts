import {ClientOptions, Driver, DriverType} from "../common";
import {KioskMessageTypes, Screenshot} from "./messages";

export class KioskDriver extends Driver {

    onTakeScreenshot?: () => any;

    constructor(options?: ClientOptions) {
        super(DriverType.Kiosk, options);
        this.client.on(KioskMessageTypes.TakeScreenshot, () => this.onTakeScreenshot && this.onTakeScreenshot());
    }

    async sendScreenshot(dataUri: string, kioskId: string) {
        await this.client.send<Screenshot>({
            "@type": KioskMessageTypes.Screenshot,
            dataUri,
            kioskId
        });
    }

}