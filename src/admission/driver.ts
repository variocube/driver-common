import {VcmpClient} from "@variocube/messaging";
import {AdmissionMessageTypes} from "./messages";
import {createDriverClient, ClientOptions, DriverType} from "../common";

export class AdmissionDriver {

    private readonly client: VcmpClient;

    constructor(options?: ClientOptions) {
        this.client = createDriverClient(DriverType.Admission, options);
    }

    async sendRequest(code: string) {
        await this.client.send({
            "@type": AdmissionMessageTypes.AdmissionRequest,
            code
        });
    }
}