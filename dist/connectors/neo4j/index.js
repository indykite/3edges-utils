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
exports.useTransaction = exports.useFormatter = exports.uniqueConnector = exports.DatabaseManagement = void 0;
const neo4j_driver_1 = __importDefault(require("neo4j-driver"));
const connector = __importStar(require("./connector"));
const formatter = __importStar(require("./formatter"));
const transaction = __importStar(require("./transaction"));
const unique = __importStar(require("./unique"));
class DatabaseManagement {
    constructor(config) {
        return connector.Neo4jConnection.getConnectionInstance(config);
    }
    static getInstance(config) {
        if (DatabaseManagement._instance) {
            if (config.host === DatabaseManagement._instance.config.host
                && config.username === DatabaseManagement._instance.config.username
                && config.password === DatabaseManagement._instance.config.password
                && config.database === DatabaseManagement._instance.config.database) {
                return DatabaseManagement._instance;
            }
        }
        DatabaseManagement._instance = new DatabaseManagement(config);
        return DatabaseManagement._instance;
    }
}
exports.DatabaseManagement = DatabaseManagement;
const useFormatter = formatter;
exports.useFormatter = useFormatter;
const uniqueConnector = unique;
exports.uniqueConnector = uniqueConnector;
const useTransaction = (neo4jConnection) => {
    return new transaction.Neo4jTransaction(neo4jConnection);
};
exports.useTransaction = useTransaction;
exports.default = neo4j_driver_1.default;
