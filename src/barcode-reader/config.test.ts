import {test} from "node:test";
import assert from "node:assert/strict";
import {BarcodeReaderConfig, Symbology, validateBarcodeConfig} from "./config";

interface Case {
    name: string;
    config: BarcodeReaderConfig;
    valid: boolean;
}

const cases: Case[] = [
    // Valid
    {name: "empty config", config: {}, valid: true},
    {
        name: "full well-formed config",
        config: {
            symbologies: {[Symbology.EAN13]: true, [Symbology.QR]: false},
            indicators: {
                led: {enabled: true, brightness: 80},
                beeper: {enabled: false, volume: 50},
                successTone: {frequencyHz: 2000, durationMs: 100},
                errorTone: {frequencyHz: 500, durationMs: 200},
            },
            triggerTiming: {
                illuminationTimeoutMs: 1000,
                idleToSleepMs: 30000,
                scanTimeoutMs: 5000,
                duplicateSuppressionMs: 500,
            },
            outputFormatting: {
                prefix: ">",
                suffix: "<",
                terminator: "CRLF",
                interCharacterDelayMs: 10,
                groupSeparator: "|",
            },
        },
        valid: true,
    },
    {name: "boundary values at limits", config: {
        indicators: {led: {brightness: 0}, beeper: {volume: 100}, successTone: {frequencyHz: 20000, durationMs: 0}},
        triggerTiming: {scanTimeoutMs: 3_600_000},
        outputFormatting: {interCharacterDelayMs: 60_000, prefix: "x".repeat(64), groupSeparator: "y".repeat(16)},
    }, valid: true},
    // Forward-compat: unknown fields ignored
    {name: "unknown top-level field ignored", config: ({foo: "bar"} as unknown) as BarcodeReaderConfig, valid: true},
    {
        name: "unknown nested field ignored",
        config: ({outputFormatting: {prefix: "p", extra: 1}} as unknown) as BarcodeReaderConfig,
        valid: true,
    },

    // Symbologies
    {
        name: "non-boolean symbology value",
        config: ({symbologies: {[Symbology.EAN13]: "yes"}} as unknown) as BarcodeReaderConfig,
        valid: false,
    },

    // Indicators: enabled must be boolean
    {
        name: "led.enabled non-boolean",
        config: ({indicators: {led: {enabled: 1}}} as unknown) as BarcodeReaderConfig,
        valid: false,
    },
    {
        name: "beeper.enabled non-boolean",
        config: ({indicators: {beeper: {enabled: "on"}}} as unknown) as BarcodeReaderConfig,
        valid: false,
    },

    // Percent bounds
    {name: "brightness below 0", config: {indicators: {led: {brightness: -1}}}, valid: false},
    {name: "brightness above 100", config: {indicators: {led: {brightness: 101}}}, valid: false},
    {name: "volume above 100", config: {indicators: {beeper: {volume: 200}}}, valid: false},
    {name: "brightness NaN", config: {indicators: {led: {brightness: NaN}}}, valid: false},
    {name: "volume Infinity", config: {indicators: {beeper: {volume: Infinity}}}, valid: false},

    // Tones
    {name: "tone frequency above ceiling", config: {indicators: {successTone: {frequencyHz: 20001}}}, valid: false},
    {name: "tone duration negative", config: {indicators: {errorTone: {durationMs: -5}}}, valid: false},

    // Trigger timing
    {name: "timeout negative", config: {triggerTiming: {scanTimeoutMs: -1}}, valid: false},
    {name: "timeout above ceiling", config: {triggerTiming: {idleToSleepMs: 3_600_001}}, valid: false},

    // Output formatting
    {
        name: "bad terminator",
        config: ({outputFormatting: {terminator: "NL"}} as unknown) as BarcodeReaderConfig,
        valid: false,
    },
    {name: "prefix too long", config: {outputFormatting: {prefix: "x".repeat(65)}}, valid: false},
    {name: "suffix too long", config: {outputFormatting: {suffix: "x".repeat(65)}}, valid: false},
    {name: "groupSeparator too long", config: {outputFormatting: {groupSeparator: "x".repeat(17)}}, valid: false},
    {name: "interCharacterDelay above ceiling", config: {outputFormatting: {interCharacterDelayMs: 60_001}}, valid: false},
];

for (const c of cases) {
    test(c.name, () => {
        const result = validateBarcodeConfig(c.config);
        assert.equal(result.valid, c.valid, JSON.stringify(result.errors));
        // errors[] is non-empty exactly when invalid
        assert.equal(result.errors.length > 0, !c.valid);
    });
}

test("each valid terminator passes", () => {
    for (const terminator of ["CR", "LF", "CRLF", "none"] as const) {
        assert.equal(validateBarcodeConfig({outputFormatting: {terminator}}).valid, true);
    }
});

test("null config is invalid, not thrown", () => {
    const result = validateBarcodeConfig((null as unknown) as BarcodeReaderConfig);
    assert.equal(result.valid, false);
});
