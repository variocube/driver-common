import {VcmpClient} from "@variocube/messaging";
import {CubeLockStatus, LockMessageTypes, OpenLock} from "./messages";
import {createDriverClient, DriverOptions, DriverType} from "../common/driver";

export class LockingDriver {

    private readonly client: VcmpClient;

    constructor(options?: DriverOptions) {
        this.client = createDriverClient(DriverType.Locking, options);
    }

    set onOpen(handler: (message: OpenLock) => Promise<void>) {
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
}

const locking = new LockingDriver();
locking.onOpen = ({id}) => Promise.resolve(console.log("opening lock " + id));
