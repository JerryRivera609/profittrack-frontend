/* eslint-disable @typescript-eslint/no-require-imports */
const path = require("node:path");

process.env.TS_NODE_PROJECT = path.resolve(
  __dirname,
  "..",
  "..",
  "..",
  "tsconfig.cucumber.json",
);

require("ts-node/register/transpile-only");
