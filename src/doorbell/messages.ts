/**
 * This module specifies messages sent from/to a door bell service.
 */

/**
 * Enum of lock message types
 */
export enum DoorBellMessageTypes {
    DoorBellAdded = "doorbell:DoorBellAdded",
    DoorBellRemoved = "doorbell:DoorBellRemoved",
    DoorBellRing = "doorbell:Ring"
}

/**
 * Issued by a door bell driver when a door bell was added to the system.
 */
export interface DoorBellAdded {
    "@type": DoorBellMessageTypes.DoorBellAdded;

    /** The id of the door bell.*/
    id: string;

}

/**
 * Issued by a bell driver driver when a door bell was removed from the system.
 */
export interface DoorBellRemoved {
    "@type": DoorBellMessageTypes.DoorBellRemoved;

    /** The id of the door bell. */
    id: string;
}

/**
 * Sent to a door bell controller to ring to the door bell with serial number @id
 */
export interface DoorBellRing {
    "@type": DoorBellMessageTypes.DoorBellRing;

    /** The id of the door bell to ring. */
    id: string;
}

export type DoorBellMessage =
    DoorBellAdded
    | DoorBellRemoved
    | DoorBellRing;
