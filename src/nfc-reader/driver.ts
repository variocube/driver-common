import {VcmpClient} from "@variocube/messaging";
import {NfcReaderMessageTypes} from "./messages";
import {createDriverClient, DriverOptions, DriverType} from "../common/driver";

export class NfcReaderDriver {

    private readonly client:VcmpClient;

    constructor(options?: DriverOptions) {
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