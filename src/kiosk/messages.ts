/**
 * This module specifies messages sent from/to a kiosk service.
 *
 * A kiosk service allows a user to interact with web application.
 */

export enum KioskMessageTypes {
    TakeScreenshot = "kiosk:TakeScreenshot",
    Screenshot = "kiosk:Screenshot"
}

export interface TakeScreenshot {
    "@type": KioskMessageTypes.TakeScreenshot;
    kioskId: string;
}

export interface Screenshot {
    "@type": KioskMessageTypes.Screenshot;
    dataUri: string;
    kioskId: string;
}

export type KioskMessage = TakeScreenshot | Screenshot;
