"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toastify = exports.neptune = exports.neo4j = exports.MetricsMgr = exports.memgraph = exports.fn = exports.DbConfigurationMgr = exports.DbConfiguration = exports.console = exports.cert = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unexpected-multiline */
require("dotenv/config");
const DbConfiguration_1 = require("./DbConfiguration");
Object.defineProperty(exports, "DbConfiguration", { enumerable: true, get: function () { return DbConfiguration_1.DbConfiguration; } });
const cert = __importStar(require("./cert/utils"));
exports.cert = cert;
const memgraph = __importStar(require("./connectors/memgraph"));
exports.memgraph = memgraph;
const neo4j = __importStar(require("./connectors/neo4j"));
exports.neo4j = neo4j;
const neptune = __importStar(require("./connectors/neptune"));
exports.neptune = neptune;
const console_1 = __importDefault(require("./console"));
exports.console = console_1.default;
const metering_1 = require("./metering");
Object.defineProperty(exports, "MetricsMgr", { enumerable: true, get: function () { return metering_1.MetricsMgr; } });
const toastify = __importStar(require("./toastify"));
exports.toastify = toastify;
const fn = __importStar(require("./utils"));
exports.fn = fn;
class DbConfigurationMgr {
    constructor(config) {
        switch (config.type) {
            case fn.DBtype.memgraph:
                // startGremlin(dbConfig)
                return memgraph.DatabaseManagement.getInstance(config);
            case fn.DBtype.neptune:
                return neptune.DatabaseManagement.getInstance(config);
            default:
                return neo4j.DatabaseManagement.getInstance(config);
        }
    }
    static getInstance(config) {
        if (DbConfigurationMgr._instance) {
            if (config.host === DbConfigurationMgr._instance.config.host
                && config.username === DbConfigurationMgr._instance.config.username
                && config.password === DbConfigurationMgr._instance.config.password
                && config.database === DbConfigurationMgr._instance.config.database) {
                return DbConfigurationMgr._instance;
            }
        }
        DbConfigurationMgr._instance = new DbConfigurationMgr(config);
        return DbConfigurationMgr._instance;
    }
}
exports.DbConfigurationMgr = DbConfigurationMgr;
