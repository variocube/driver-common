/**
 * This module specifies messages sent from/to a lock service.
 */

/**
 * Enum of lock message types
 */
export enum LockMessageTypes {
    LockAdded = "locking:LockAdded",
    LockRemoved = "locking:LockRemoved",
    LockStatusChanged = "locking:LockStatusChanged",
    OpenLock = "locking:OpenLock",
    LockOpenRequest = "locking:LockOpenRequest",
    LockCloseRequest = "locking:LockCloseRequest"
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
 * Issued by a locking driver when a lock was added to the system.
 */
export interface LockAdded {
    "@type": LockMessageTypes.LockAdded;

    /** The id of the lock. Must be unique within a cube. */
    id: string;

    /** The lock status. */
    status: CubeLockStatus;
}

/**
 * Issued by a locking driver when a lock was removed from the system.
 */
export interface LockRemoved {
    "@type": LockMessageTypes.LockRemoved;

    /** The id of the lock. Must be unique within a cube. */
    id: string;
}

/**
 * Issued by a locking driver when a lock status changed.
 */
export interface LockStatusChanged {
    "@type": LockMessageTypes.LockStatusChanged;

    /** The id of the lock. Must be unique within a cube. */
    id: string;

    /** The lock status. */
    status: CubeLockStatus;
}

/**
 * Issued by a locking driver when opening a lock is requested using an access key.
 * This is only applicable for locks that support reading an access key (RFID data carrier, etc.)
 */
export interface LockOpenRequest {
    "@type": LockMessageTypes.LockOpenRequest;

    /** The id of the lock. Must be unique within a cube. */
    id: string;

    /** The access key. */
    accessKey: string;
}

/**
 * Issued by a locking driver when closing a lock is requested using an access key.
 * This is only applicable for locks that support reading an access key (RFID data carrier, etc.)
 */
export interface LockCloseRequest {
    "@type": LockMessageTypes.LockCloseRequest;

    /** The id of the lock. Must be unique within a cube. */
    id: string;

    /** The access key. */
    accessKey: string;
}

/**
 * Sent to a lock lock to open a lock
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
    | OpenLock
    | LockOpenRequest
    | LockCloseRequest;
