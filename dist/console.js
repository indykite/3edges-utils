"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
switch (process.env.LOG_LEVEL) {
    case "none":
        console.error = function () { };
        console.warn = function () { };
        console.debug = function () { };
        console.info = function () { };
        console.log = function () { };
        break;
    case "error":
        console.warn = function () { };
        console.debug = function () { };
        console.info = function () { };
        console.log = function () { };
        break;
    case "warn":
        console.debug = function () { };
        console.info = function () { };
        console.log = function () { };
        break;
    case "debug":
        console.info = function () { };
        console.log = function () { };
        break;
    case "info":
        console.log = function () { };
        break;
    default:
    // All enabled by default
}
exports.default = console;
