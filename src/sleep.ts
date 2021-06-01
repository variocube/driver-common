/**
 * Returns a promise that resolves after the specified number of milliseconds.
 * @param timeoutMs
 */
export function sleep(timeoutMs: number) {
    return new Promise<void>(((resolve) => setTimeout(() => resolve(), timeoutMs)));
}