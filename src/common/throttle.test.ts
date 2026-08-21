import {test} from "node:test";
import assert from "node:assert/strict";
import {Throttle} from "./throttle";

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/** Runs `fn` while capturing the delay argument of every setTimeout call it makes. */
async function captureTimeoutDelays(fn: () => Promise<void>) {
    const delays: number[] = [];
    const original = global.setTimeout;
    global.setTimeout = ((callback: (...args: unknown[]) => void, delay?: number, ...args: unknown[]) => {
        delays.push(delay ?? 0);
        return original(callback, delay, ...args);
    }) as typeof setTimeout;
    try {
        await fn();
    }
    finally {
        global.setTimeout = original;
    }
    return delays;
}

test("acquire after an idle period passes a non-negative delay to setTimeout", async () => {
    const throttle = new Throttle(10);
    // idle longer than recoveryMs, so recoveryMs - elapsed would be negative without clamping
    await sleep(30);
    const delays = await captureTimeoutDelays(() => throttle.run(() => {}));
    assert.ok(delays.length > 0, "expected acquire to schedule via setTimeout");
    assert.equal(delays[0], 0, "recovery window already elapsed, delay must be clamped to 0");
});

test("acquire after release-stamped idle period passes a non-negative delay", async () => {
    const throttle = new Throttle(10);
    await throttle.run(() => {});
    // idle again after release() updated the last-run timestamp
    await sleep(30);
    const delays = await captureTimeoutDelays(() => throttle.run(() => {}));
    for (const delay of delays) {
        assert.ok(delay >= 0, `negative delay ${delay} passed to setTimeout`);
    }
});

test("consecutive actions are spaced by the recovery time", async () => {
    const throttle = new Throttle(50);
    const times: number[] = [];
    await Promise.all([
        throttle.run(() => {
            times.push(Date.now());
        }),
        throttle.run(() => {
            times.push(Date.now());
        }),
    ]);
    assert.equal(times.length, 2);
    // allow a little scheduling slack
    assert.ok(times[1] - times[0] >= 45, `expected >= 45ms between actions, got ${times[1] - times[0]}ms`);
});

test("only one action runs at a time", async () => {
    const throttle = new Throttle(1);
    let active = 0;
    let maxActive = 0;
    await Promise.all([1, 2, 3].map(() =>
        throttle.run(async () => {
            active++;
            maxActive = Math.max(maxActive, active);
            await sleep(10);
            active--;
        })
    ));
    assert.equal(maxActive, 1);
});
