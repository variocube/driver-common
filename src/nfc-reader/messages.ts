/**
 * This module specifies messages sent from an NFC reader service.
 *
 * An NFC reader service would always listen for presented cards
 * on the NFC reader and send a message when a card is presented.
 */

export enum NfcReaderMessageTypes {
    CardPresented = "nfc-reader:CardPresented",
    CardRemoved = "nfc-reader:CardRemoved",
}

export interface CardPresented {
    "@type": NfcReaderMessageTypes.CardPresented;

    /** The unique card id as a base64-encoded string. */
    uid: string;

    /** The unit at which the card was presented. */
    unit: string;
}

export interface CardRemoved {
    "@type": NfcReaderMessageTypes.CardRemoved;

    /** The unit at which the card was removed. */
    unit: string;
}

export type NfcReaderMessage =
    CardPresented | CardRemoved;
