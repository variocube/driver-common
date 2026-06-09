/**
 * Standardized v1 configuration schema for barcode reader drivers.
 *
 * The controller sends a (possibly partial) {@link BarcodeReaderConfig} to a driver.
 * The driver overlays the received config on its own vendor default profile and
 * translates it into vendor-specific commands. Any unsupported property is silently
 * skipped at apply time, so this schema stays forward-compatible: adding fields here
 * never breaks an older driver.
 *
 * All groups are optional. A controller may send any subset.
 */

/**
 * Barcode symbologies (code types) a reader may support.
 *
 * This is an open v1 subset; readers may support additional symbologies not listed
 * here. Drivers skip symbologies they do not recognize.
 */
export enum Symbology {
    EAN13 = "EAN13",
    EAN8 = "EAN8",
    UPCA = "UPCA",
    UPCE = "UPCE",
    Code128 = "Code128",
    Code39 = "Code39",
    QR = "QR",
    DataMatrix = "DataMatrix",
    PDF417 = "PDF417",
    Aztec = "Aztec",
}

/**
 * Configuration for an audible feedback tone.
 */
export interface ToneConfig {
    /** Tone frequency in Hertz. Typical range 1000–4000. */
    frequencyHz?: number;

    /** Tone duration in milliseconds. Non-negative. */
    durationMs?: number;
}

/**
 * Visual and audible feedback indicators.
 *
 * Note: `brightness` and `volume` are standardized to a 0–100 percentage in this
 * schema. Physical readers may use other scales (e.g. 0–255 or discrete levels);
 * since this schema is device-agnostic and we do not assume any vendor's units,
 * the driver is responsible for mapping the percentage onto the device's scale.
 */
export interface IndicatorConfig {
    /** Scan indicator LED. */
    led?: {
        /** Whether the LED is enabled. */
        enabled?: boolean;

        /** LED brightness as a percentage, 0–100. */
        brightness?: number;
    };

    /** Scan beeper. */
    beeper?: {
        /** Whether the beeper is enabled. */
        enabled?: boolean;

        /** Beeper volume as a percentage, 0–100. */
        volume?: number;
    };

    /** Tone played on a successful scan. */
    successTone?: ToneConfig;

    /** Tone played on a failed/error scan. */
    errorTone?: ToneConfig;
}

/**
 * Trigger timing parameters.
 *
 * Note: trigger mode (e.g. manual/continuous/presentation) is explicitly out of
 * scope for v1 — there is no command for it yet, so no `mode` field exists here.
 */
export interface TriggerTimingConfig {
    /** How long illumination stays on while attempting a scan, in milliseconds. Non-negative. */
    illuminationTimeoutMs?: number;

    /** Idle time before the reader enters sleep, in milliseconds. Non-negative. */
    idleToSleepMs?: number;

    /** Maximum time to attempt a single scan before giving up, in milliseconds. Non-negative. */
    scanTimeoutMs?: number;

    /** Window during which an identical re-scan is suppressed, in milliseconds. Non-negative. */
    duplicateSuppressionMs?: number;
}

/**
 * Line terminator appended after the decoded data (and suffix).
 *
 * Consumed by the driver as the scan FRAMING delimiter: it marks end-of-scan,
 * is stripped, and is never forwarded to the app. It is therefore a small, closed
 * set on purpose — the read path must recognise and strip this exact sequence, so
 * every added value is a new framing case. The decoded payload (and any prefix/
 * suffix) MUST NOT contain the active terminator, or the scan frames early.
 *
 * "none" disables the in-band terminator; the driver then frames by idle-timeout
 * (flush on serial silence). This is the supported path for arbitrary BINARY
 * payloads, where no in-band delimiter is safe. See variocube/drivers#16.
 */
export type OutputTerminator = "CR" | "LF" | "CRLF" | "none";

/**
 * Output formatting applied to the decoded barcode data before it is emitted.
 *
 * prefix and suffix are content decoration: the reader adds them and the driver
 * passes them THROUGH to the app unchanged (they are not stripped — stripping
 * them would make configuring them pointless). Only the terminator is consumed by
 * the driver (see OutputTerminator). Because the terminator is the frame delimiter,
 * prefix and suffix must not contain the active terminator sequence.
 */
export interface OutputFormattingConfig {
    /** String prepended to the decoded data and forwarded to the app. Max 64 chars. Must not contain the terminator sequence. */
    prefix?: string;

    /** String appended to the decoded data (before the terminator) and forwarded to the app. Max 64 chars. Must not contain the terminator sequence. */
    suffix?: string;

    /** Line terminator appended after the data. */
    terminator?: OutputTerminator;

    /** Delay between emitted characters, in milliseconds. Non-negative. */
    interCharacterDelayMs?: number;

    /** Separator inserted between grouped data segments. Max 16 characters. */
    groupSeparator?: string;
}

/**
 * Standardized v1 barcode reader configuration. All groups are optional; a
 * controller may send any subset and the driver overlays it on its default profile.
 */
export interface BarcodeReaderConfig {
    /** Enable/disable decoding per symbology. */
    symbologies?: Partial<Record<Symbology, boolean>>;

    /** Visual and audible feedback indicators. */
    indicators?: IndicatorConfig;

    /** Trigger timing parameters. */
    triggerTiming?: TriggerTimingConfig;

    /** Output formatting applied to decoded data. */
    outputFormatting?: OutputFormattingConfig;
}

/**
 * Result of validating a {@link BarcodeReaderConfig}.
 */
export interface ValidationResult {
    /** Whether the config passed validation. */
    valid: boolean;

    /** Human-readable validation errors. Empty when {@link valid} is `true`. */
    errors: string[];
}

const VALID_TERMINATORS: ReadonlyArray<OutputTerminator> = ["CR", "LF", "CRLF", "none"];
const MAX_PREFIX_SUFFIX_LENGTH = 64;
const MAX_GROUP_SEPARATOR_LENGTH = 16;

/** Byte sequences each terminator maps to on the wire. `none` has no in-band bytes. */
const TERMINATOR_BYTES: Record<Exclude<OutputTerminator, "none">, string> = {
    CR: "\r",
    LF: "\n",
    CRLF: "\r\n",
};

/** Sanity ceilings — not vendor limits, just to catch fat-finger / nonsensical values. */
const MAX_TIMEOUT_MS = 3_600_000; // 1 hour
const MAX_INTER_CHARACTER_DELAY_MS = 60_000; // 1 minute
const MAX_FREQUENCY_HZ = 20_000; // upper edge of human hearing

/**
 * Validates a {@link BarcodeReaderConfig} against the v1 schema.
 *
 * Pure, dependency-free, and never throws. This is the single source of truth used
 * by both the SDK (pre-send, for fast developer feedback) and the driver (on-receive,
 * as defense in depth).
 *
 * Unknown/extra fields are intentionally ignored (forward-compatibility) — they do
 * not cause validation to fail.
 */
export function validateBarcodeConfig(config: BarcodeReaderConfig): ValidationResult {
    const errors: string[] = [];

    if (config === null || typeof config !== "object") {
        return {valid: false, errors: ["config must be an object"]};
    }

    const checkPercent = (value: unknown, path: string) => {
        if (value === undefined) {
            return;
        }
        if (typeof value !== "number" || !isFinite(value)) {
            errors.push(`${path} must be a number`);
        } else if (value < 0 || value > 100) {
            errors.push(`${path} must be between 0 and 100`);
        }
    };

    const checkNonNegative = (value: unknown, path: string, max?: number) => {
        if (value === undefined) {
            return;
        }
        if (typeof value !== "number" || !isFinite(value)) {
            errors.push(`${path} must be a number`);
        } else if (value < 0) {
            errors.push(`${path} must be non-negative`);
        } else if (max !== undefined && value > max) {
            errors.push(`${path} must be at most ${max}`);
        }
    };

    const checkBoolean = (value: unknown, path: string) => {
        if (value === undefined) {
            return;
        }
        if (typeof value !== "boolean") {
            errors.push(`${path} must be a boolean`);
        }
    };

    const checkString = (value: unknown, path: string, maxLength: number) => {
        if (value === undefined) {
            return;
        }
        if (typeof value !== "string") {
            errors.push(`${path} must be a string`);
        } else if (value.length > maxLength) {
            errors.push(`${path} must be at most ${maxLength} characters`);
        }
    };

    const {symbologies, indicators, triggerTiming, outputFormatting} = config;

    if (symbologies !== undefined) {
        if (typeof symbologies !== "object" || symbologies === null) {
            errors.push("symbologies must be an object");
        } else {
            for (const [key, value] of Object.entries(symbologies)) {
                if (typeof value !== "boolean") {
                    errors.push(`symbologies.${key} must be a boolean`);
                }
            }
        }
    }

    if (indicators !== undefined) {
        checkBoolean(indicators.led?.enabled, "indicators.led.enabled");
        checkBoolean(indicators.beeper?.enabled, "indicators.beeper.enabled");
        checkPercent(indicators.led?.brightness, "indicators.led.brightness");
        checkPercent(indicators.beeper?.volume, "indicators.beeper.volume");
        for (const tone of [["successTone", indicators.successTone] as const, ["errorTone", indicators.errorTone] as const]) {
            const [name, value] = tone;
            if (value !== undefined) {
                checkNonNegative(value.frequencyHz, `indicators.${name}.frequencyHz`, MAX_FREQUENCY_HZ);
                checkNonNegative(value.durationMs, `indicators.${name}.durationMs`, MAX_TIMEOUT_MS);
            }
        }
    }

    if (triggerTiming !== undefined) {
        checkNonNegative(triggerTiming.illuminationTimeoutMs, "triggerTiming.illuminationTimeoutMs", MAX_TIMEOUT_MS);
        checkNonNegative(triggerTiming.idleToSleepMs, "triggerTiming.idleToSleepMs", MAX_TIMEOUT_MS);
        checkNonNegative(triggerTiming.scanTimeoutMs, "triggerTiming.scanTimeoutMs", MAX_TIMEOUT_MS);
        checkNonNegative(triggerTiming.duplicateSuppressionMs, "triggerTiming.duplicateSuppressionMs", MAX_TIMEOUT_MS);
    }

    if (outputFormatting !== undefined) {
        checkString(outputFormatting.prefix, "outputFormatting.prefix", MAX_PREFIX_SUFFIX_LENGTH);
        checkString(outputFormatting.suffix, "outputFormatting.suffix", MAX_PREFIX_SUFFIX_LENGTH);
        checkString(outputFormatting.groupSeparator, "outputFormatting.groupSeparator", MAX_GROUP_SEPARATOR_LENGTH);
        checkNonNegative(outputFormatting.interCharacterDelayMs, "outputFormatting.interCharacterDelayMs", MAX_INTER_CHARACTER_DELAY_MS);
        const {terminator, prefix, suffix} = outputFormatting;
        if (terminator !== undefined && !VALID_TERMINATORS.includes(terminator)) {
            errors.push(`outputFormatting.terminator must be one of ${VALID_TERMINATORS.join(", ")}`);
        } else if (terminator !== undefined && terminator !== "none") {
            // The terminator is the frame delimiter; if prefix/suffix carry it, the scan frames early.
            const bytes = TERMINATOR_BYTES[terminator];
            if (typeof prefix === "string" && prefix.includes(bytes)) {
                errors.push(`outputFormatting.prefix must not contain the ${terminator} terminator sequence`);
            }
            if (typeof suffix === "string" && suffix.includes(bytes)) {
                errors.push(`outputFormatting.suffix must not contain the ${terminator} terminator sequence`);
            }
        }
    }

    return {valid: errors.length === 0, errors};
}
