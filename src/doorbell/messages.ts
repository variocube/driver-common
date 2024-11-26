/**
 * This module specifies messages sent from/to a doorbell driver.
 */

/**
 * Enum of lock message types
 */
export enum DoorbellMessageTypes {
    DoorbellRing = "doorbell:Ring"
}
/**
 * Sent to a doorbell driver to ring to the doorbell with serial number @id
 */
export interface DoorBellRing {
    "@type": DoorbellMessageTypes.DoorbellRing;

    /** The serial number of the doorbell to ring. */
    serialNumber: string;
}
