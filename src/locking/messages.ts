/**
 * This module specifies messages sent from/to a lock service.
 */

/**
 * Enum of lock message types
 */
export enum LockMessageTypes {
    LockAdded = "lock:LockAdded",
    LockRemoved = "lock:LockRemoved",
    LockStatusChanged = "lock:LockStatusChanged",
    OpenLock = "lock:OpenLock"
}

/**
 * Enum of lock status.
 */
export enum CubeLockStatus {
    /** The lock is open */
    Open = "Open",

    /** The lock is closed */
    Closed = "Closed",

    /** The lock was opened without an open command */
    Breakin = "Breakin",

    /** The lock stayed closed even though an open command was sent */
    Blocked = "Blocked"
}


/**
 * Issued by the lock service when a lock was added to the system.
 */
export interface LockAdded {
    "@type": LockMessageTypes.LockAdded;

    /** The id of the lock. Must be unique within a cube. */
    id: string;

    /** The lock status. */
    status: CubeLockStatus;
}

/**
 * Issued by the lock service when a lock was removed from the system.
 */
export interface LockRemoved {
    "@type": LockMessageTypes.LockRemoved;

    /** The id of the lock. Must be unique within a cube. */
    id: string;
}

/**
 * Issued by the lock service when a lock status changed.
 */
export interface LockStatusChanged {
    "@type": LockMessageTypes.LockStatusChanged;

    /** The id of the lock. Must be unique within a cube. */
    id: string;

    /** The lock status. */
    status: CubeLockStatus;
}

/**
 * Sent to lock service to open a lock
 */
export interface OpenLock {
    "@type": LockMessageTypes.OpenLock;

    /** The id of the lock to open. */
    id: string;
}

export type LockMessage =
    LockAdded
    | LockRemoved
    | LockStatusChanged
    | OpenLock;
