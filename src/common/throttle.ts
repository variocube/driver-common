type ResolveFunc = (value: PromiseLike<void> | void) => PromiseLike<void> | void;

/**
 * Throttles the execution of actions:
 *  - Only one at a time
 *  - Leave some time for recovery between consecutive actions
 */
export class Throttle {

    constructor(
        /** The recovery time in ms to wait before running the next pending action. */
        private readonly recoveryMs: number
    ) {
    }

    private running = false;
    private readonly waiting: ResolveFunc[] = [];
    private last = Date.now();

    async run(fn: () => void | Promise<void>) {
        try {
            await this.acquire();
            await fn();
        }
        finally {
            this.release();
        }
    }

    private acquire() {
        return new Promise<void>(resolve => {
            if (this.running) {
                this.waiting.push(resolve);
            }
            else {
                this.running = true;
                setTimeout(resolve, this.recoveryMs - (Date.now() - this.last));
            }
        })
    }

    private release() {
        const next = this.waiting.shift();
        if (next) {
            setTimeout(next, this.recoveryMs);
        }
        else {
            this.running = false;
        }
        this.last = Date.now();
    }
}