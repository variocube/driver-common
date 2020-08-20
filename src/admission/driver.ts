import {VcmpClient} from "@variocube/messaging";
import {AdmissionMessageTypes} from "./messages";
import {createDriverClient, DriverOptions, DriverType} from "../common/driver";

export class AdmissionDriver {

    private readonly client:VcmpClient;

    constructor(options?: DriverOptions) {
        this.client = createDriverClient(DriverType.Admission, options);
    }

    async sendRequest(code: string) {
        await this.client.send({
            "@type": AdmissionMessageTypes.AdmissionRequest,
            code
        });
    }
}