/**
 * Returns a promise that rejects after the specified number of milliseconds.
 * @param timeoutMs
 */
export function timeout(timeoutMs: number) {
    return new Promise(((resolve, reject) => setTimeout(() => reject("Timeout"), timeoutMs)));
}