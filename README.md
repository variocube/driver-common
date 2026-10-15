# Common base for Variocube drivers

## Usage

### Logger

```typescript
// Write log messages
const log = new Logger("My module");
log.info("Hello", {foo: "bar"});
log.verbose("A verbose message");

// Log level can be set globally
Logger.setLogLevel(LogLevel.silly);
```

### Drivers

All drivers work the same way. Here are some examples for the locking driver:

```typescript
const locking = new LockingDriver();
locking.onOpenLock = async ({id}) => {
    console.log("Opening lock", id);
    // Here you actually open the lock
}

// Send lock added
await locking.sendLockAdded("demoLock1", CubeLockStatus.Closed);

// Notify that lock status changed
await locking.sendLockStatusChanged("demoLock1", CubeLockStatus.Open);

// A send that is not awaited still needs a rejection handler
locking.sendLockStatusChanged("demoLock1", CubeLockStatus.Closed)
    .catch(error => console.error("Controller did not accept the lock status", error));
```

The `send*` methods resolve once the controller acknowledged the message. They reject with a `VcmpError` when the
controller refuses the message (NAK), and with status 503 when the controller connection is gone: the driver is not
connected, or the connection closes before the controller acknowledged the message. Callers must handle the
rejection — an unhandled rejection ends a Node.js process. The driver reconnects on its own; whether to resend a
message after a reconnect is up to the caller.

Tell the cases apart by `error.status`, not by `instanceof VcmpError`: driver-common does not re-export `VcmpError`,
and the class from your own `@variocube/vcmp` dependency may be a different copy than the one driver-common uses.

Handlers (`onOpenLock`, `onRestartDevice`, …) acknowledge a message by returning, and refuse it by throwing. The
error is sent to the controller as the NAK's problem detail. Return nothing: the controller expects no
acknowledgement payload, and `onRestartDevice` and `onTakeScreenshot` discard a returned value.

## Migrating from 2.x to 3.0.0

3.0.0 requires `@variocube/vcmp` 4.2 or later. It abandons a connection whose heartbeat stops (after twice the
controller's heartbeat interval) without waiting for the close handshake, and reconnects after the reconnect timeout.

- **Do not pin an older vcmp.** An `overrides` (or `resolutions`) entry for `@variocube/vcmp` below 4.2 wins over
  driver-common's `^4.2.0` and silently drops the fixes this release exists for. Remove or raise it.
- **`send*` methods reject where they used to hang.** With 2.x, a message whose connection closed before the ACK never
  settled. Now it rejects with a `VcmpError` (status 503). A send that is not awaited inside a `try` (fire and forget)
  needs a `.catch(...)`.
- **Every rejection is a `VcmpError`.** 2.x rejected with whatever happened to fail — the string `"NAK"`,
  `Error("No session.")`, or `ws`'s `Error("WebSocket is not open: readyState 0 (CONNECTING)")`. Now each is a
  `VcmpError` with `status` and `detail`; code that matched on these values must check `error.status` instead.
- **A throwing handler's error reaches the controller** as the NAK's problem detail (title, status, detail). Do not
  put secrets into error messages thrown from handlers.
- **The driver expects the controller's heartbeat.** A session in which no heartbeat arrives within 60 seconds is
  closed and reconnected. The Java controller and controller-rs both send one.
