/**
 * This module specifies messages sent from an access code service.
 *
 * An admission code service is most of the time some kind of device which reads code input from users such as
 * a keypad with a small display. A user is able to provide a code through this mechanism. Access codes are checked
 * by the controller against current occupancies and if the access code is found, primary doors (such as roller doors or
 * entrance doors are unlocked). So the access code merely allows access to the facility before the user is even
 * able to access the actual terminal of a cube.
 */

export enum AdmissionMessageTypes {
    AdmissionRequest = "admission:AdmissionRequest",
}

export interface AdmissionRequest {
    "@type": AdmissionMessageTypes.AdmissionRequest;

    /** The code which as been entered or provided by the user. */
    code: string;

    /** A specific box number which was configured for the admission keypad. */
    boxNumber?: string;

    /** A specific box type which was configured for the admission keypad. */
    boxType?: string;

}

export type AdmissionRequestMessages = AdmissionRequest;
