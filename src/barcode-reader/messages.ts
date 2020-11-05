/**
 * This module specifies messages sent from a barcode reader service.
 *
 * An barcode reader service would always listen for presented barcodes
 * and send a message when a barcode is successfully scanned.
 */

export enum BarcodeReaderMessageTypes {
    BarcodeScanned = "barcode-reader:BarcodeScanned",
}

export interface BarcodeScanned {
    "@type": BarcodeReaderMessageTypes.BarcodeScanned;

    /** The barcode data as a base64-encoded string. */
    code: string;
}

export type BarcodeReaderMessage =
    BarcodeScanned;
