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

All drivers work the same. Here are some examples for the locking driver:

```typescript
const locking = new LockingDriver();
locking.onOpen = async ({id}) => {
    console.log("Opening lock", id);
    // Here you actually open the lock
}

// Send lock added
await locking.sendLockAdded("demoLock1", CubeLockStatus.Closed);

// Notify that lock status changed
await lock.sendLockStatusChanged("demoLock1", CubeLockStatus.Open);
```
