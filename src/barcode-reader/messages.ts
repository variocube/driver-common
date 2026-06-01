/**
 * This module specifies messages sent from a barcode reader service.
 *
 * An barcode reader service would always listen for presented barcodes
 * and send a message when a barcode is successfully scanned.
 */

import {BarcodeReaderConfig} from "./config";

export enum BarcodeReaderMessageTypes {
    BarcodeScanned = "barcode-reader:BarcodeScanned",
    Configure = "barcode-reader:Configure",
}

export interface BarcodeScanned {
    "@type": BarcodeReaderMessageTypes.BarcodeScanned;

    /** The barcode data as a base64-encoded string. */
    code: string;

    /** The unit at which the barcode was scanned. */
    unit: string;
}

/**
 * Sent to a barcode reader driver to (re)configure the reader.
 *
 * The config may be partial; the driver overlays it on its default vendor profile.
 */
export interface ConfigureBarcodeReader {
    "@type": BarcodeReaderMessageTypes.Configure;

    /** The standardized barcode reader configuration to apply. */
    config: BarcodeReaderConfig;
}

export type BarcodeReaderMessage =
    BarcodeScanned
    | ConfigureBarcodeReader;
