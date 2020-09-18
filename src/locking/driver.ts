import {CubeLockStatus, LockMessageTypes, OpenLock} from "./messages";
import {ClientOptions, Driver, DriverType} from "../common";

export class LockingDriver extends Driver {

    constructor(options?: ClientOptions) {
        super(DriverType.Locking, options);
    }

    set onOpenLock(handler: (message: OpenLock) => Promise<void>) {
        this.client.on(LockMessageTypes.OpenLock, handler);
    }

    async sendLockAdded(lockId: string, status: CubeLockStatus) {
        await this.client.send({
            "@type": LockMessageTypes.LockAdded,
            id: lockId,
            status,
        });
    }

    async sendLockRemoved(lockId: string) {
        await this.client.send({
            "@type": LockMessageTypes.LockRemoved,
            id: lockId
        });
    }

    async sendLockStatusChanged(lockId: string, status: CubeLockStatus) {
        await this.client.send({
            "@type": LockMessageTypes.LockStatusChanged,
            id: lockId,
            status,
        });
    }

    async sendLockOpenRequest(lockId: string, accessKey: string) {
        await this.client.send({
            "@type": LockMessageTypes.LockOpenRequest,
            id: lockId,
            accessKey,
        });
    }

    async sendLockCloseRequest(lockId: string, accessKey: string) {
        await this.client.send({
            "@type": LockMessageTypes.LockCloseRequest,
            id: lockId,
            accessKey,
        });
    }
}
