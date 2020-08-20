import {VcmpClient} from "@variocube/messaging";
import {NfcReaderMessageTypes} from "./messages";
import {createDriverClient, ClientOptions, DriverType} from "../common";

export class NfcReaderDriver {

    private readonly client:VcmpClient;

    constructor(options?: ClientOptions) {
        this.client = createDriverClient(DriverType.NfcReader, options);
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