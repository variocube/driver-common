import {CardPresented, CardRemoved, NfcReaderMessageTypes} from "./messages";
import {ClientOptions, Driver, DriverType} from "../common";

export class NfcReaderDriver extends Driver {

    constructor(options?: ClientOptions) {
        super(DriverType.NfcReader, options);
    }

    async sendCardPresented(uid: string, unit: string) {
        await this.client.send<CardPresented>({
            "@type": NfcReaderMessageTypes.CardPresented,
            uid,
            unit,
        });
    }

    async sendCardRemoved(unit: string) {
        await this.client.send<CardRemoved>({
            "@type": NfcReaderMessageTypes.CardRemoved,
            unit,
        });
    }

}