import {BarcodeReaderMessageTypes} from "./messages";
import {ClientOptions, Driver, DriverType} from "../common";

export class BarcodeReaderDriver extends Driver {

    constructor(options?: ClientOptions) {
        super(DriverType.BarcodeReader, options);
    }

    async sendBarcodeScanned(code: string) {
        await this.client.send({
            "@type": BarcodeReaderMessageTypes.BarcodeScanned,
            code
        });
    }

}