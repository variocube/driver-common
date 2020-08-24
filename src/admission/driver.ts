import {AdmissionMessageTypes} from "./messages";
import {ClientOptions, Driver, DriverType} from "../common";

export class AdmissionDriver extends Driver {

    constructor(options?: ClientOptions) {
        super(DriverType.Admission, options);
    }

    async sendRequest(code: string) {
        await this.client.send({
            "@type": AdmissionMessageTypes.AdmissionRequest,
            code
        });
    }
}