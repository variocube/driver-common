const {writeFileSync} = require("node:fs");

// Mark each build subtree with the correct module system so Node resolves
// esm/*.js as ES modules and cjs/*.js as CommonJS, independent of the root
// package.json (which has no "type" field). Without these, Node falls back to
// source-detection and warns with MODULE_TYPELESS_PACKAGE_JSON.
writeFileSync("esm/package.json", JSON.stringify({type: "module"}) + "\n");
writeFileSync("cjs/package.json", JSON.stringify({type: "commonjs"}) + "\n");
