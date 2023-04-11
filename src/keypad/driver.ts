import {KeypadMessageTypes, AdmissionRequest, AccessCode} from "./messages";
import {ClientOptions, Driver, DriverType} from "../common";

export class KeypadDriver extends Driver {

    constructor(options?: ClientOptions) {
        super(DriverType.Keypad, options);
    }

    async sendAdmissionRequest(request: Omit<AdmissionRequest, "@type">) {
        await this.client.send({
            "@type": KeypadMessageTypes.AdmissionRequest,
            ...request
        });
    }

    async sendAccessCode(request: Omit<AccessCode, "@type">) {
        await this.client.send({
            "@type": KeypadMessageTypes.AccessCode,
            ...request
        })
    }
}