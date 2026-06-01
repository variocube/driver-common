import {BarcodeReaderMessageTypes, BarcodeScanned, ConfigureBarcodeReader} from "./messages";
import {ClientOptions, Driver, DriverType} from "../common";

export class BarcodeReaderDriver extends Driver {

    constructor(options?: ClientOptions) {
        super(DriverType.BarcodeReader, options);
    }

    set onConfigure(handler: (message: ConfigureBarcodeReader) => Promise<void>) {
        this.client.on(BarcodeReaderMessageTypes.Configure, handler);
    }

    async sendBarcodeScanned(code: string, unit: string) {
        await this.client.send<BarcodeScanned>({
            "@type": BarcodeReaderMessageTypes.BarcodeScanned,
            code,
            unit,
        });
    }

}