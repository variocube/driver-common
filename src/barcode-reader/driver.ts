import {BarcodeReaderMessageTypes, BarcodeScanned} from "./messages";
import {ClientOptions, Driver, DriverType} from "../common";

export class BarcodeReaderDriver extends Driver {

    constructor(options?: ClientOptions) {
        super(DriverType.BarcodeReader, options);
    }

    async sendBarcodeScanned(code: string, unit: string) {
        await this.client.send<BarcodeScanned>({
            "@type": BarcodeReaderMessageTypes.BarcodeScanned,
            code,
            unit,
        });
    }

}