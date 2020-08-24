import {NfcReaderMessageTypes} from "./messages";
import {ClientOptions, Driver, DriverType} from "../common";

export class NfcReaderDriver extends Driver {

    constructor(options?: ClientOptions) {
        super(DriverType.NfcReader, options);
    }

    async sendCardPresented(uid: string, lock?: string) {
        await this.client.send({
            "@type": NfcReaderMessageTypes.CardPresented,
            uid,
            lock
        });
    }

    async sendCardRemoved(lockId: string) {
        await this.client.send({
            "@type": NfcReaderMessageTypes.CardRemoved
        });
    }

}