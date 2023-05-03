/**
 * This module specifies messages sent from a keypad.
 *
 * Keypads can operate in two different modes:
 * - Admission mode is used to enter a place that is otherwise closed by a door or any kind of barrier. If the
 *   user enters an access code of a current occupancy, the controller will open the configured lock.
 * - Access code mode is used to enter an access code on a keypad next to terminal. The access code will be sent
 *   to applications which can decide how to handle the code.
 */

export enum KeypadMessageTypes {
    AdmissionRequest = "admission:AdmissionRequest",
    AccessCode = "keypad:AccessCode",
}

export interface AdmissionRequest {
    "@type": KeypadMessageTypes.AdmissionRequest;

    /** The code which as been entered or provided by the user. */
    code: string;

    /** A specific box number which was configured for the admission keypad. */
    boxNumber?: string;

    /** A specific box type which was configured for the admission keypad. */
    boxType?: string;

}

export interface AccessCode {
    "@type": KeypadMessageTypes.AccessCode,

    /** The access code that was entered with the keypad. */
    code: string;

    /** The unit at which the access code was entered. */
    unit: string;
}

export type KeypadMessages = AdmissionRequest | AccessCode;
