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

    /** The lock the card was presented at, or undefined if the card was presented at a terminal. */
    lock?: string;
}

export interface CardRemoved {
    "@type": NfcReaderMessageTypes.CardRemoved;
}

export type NfcReaderMessage =
    CardPresented | CardRemoved;
