"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFormatter = exports.uniqueConnector = exports.DatabaseManagement = void 0;
const crypto = __importStar(require("@aws-crypto/sha256-js"));
const credential_provider_node_1 = require("@aws-sdk/credential-provider-node");
const protocol_http_1 = require("@aws-sdk/protocol-http");
const signature_v4_1 = require("@aws-sdk/signature-v4");
const neo4j_driver_1 = __importDefault(require("neo4j-driver"));
const formatter = __importStar(require("../neo4j/formatter"));
const unique = __importStar(require("../neo4j/unique"));
const connector = __importStar(require("./connector"));
const signedHeader = ({ region, port, serviceName, protocol, host, hostPort }) => __awaiter(void 0, void 0, void 0, function* () {
    const req = new protocol_http_1.HttpRequest({
        method: "GET",
        protocol: protocol,
        hostname: host,
        port: port,
        path: "/opencypher",
        headers: {
            host: hostPort
        }
    });
    const signer = new signature_v4_1.SignatureV4({
        credentials: (0, credential_provider_node_1.defaultProvider)(),
        region: region,
        service: serviceName,
        sha256: crypto.Sha256
    });
    return signer.sign(req, { unsignableHeaders: new Set(["x-amz-content-sha256"]) }).then((signedRequest) => {
        const authInfo = {
            "Authorization": signedRequest.headers["authorization"],
            "HttpMethod": signedRequest.method,
            "X-Amz-Date": signedRequest.headers["x-amz-date"],
            "Host": signedRequest.headers["host"],
            "X-Amz-Security-Token": signedRequest.headers["x-amz-security-token"]
        };
        return JSON.stringify(authInfo);
    });
});
const createDriver = (info) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const region = (_a = info.neptune) === null || _a === void 0 ? void 0 : _a.region;
    const serviceName = (_b = info.neptune) === null || _b === void 0 ? void 0 : _b.serviceName;
    const port = 8182;
    const protocol = "bolt";
    const host = info.host;
    const hostPort = host + ":" + port;
    const url = protocol + "://" + hostPort;
    const authToken = {
        scheme: "basic",
        realm: "realm",
        principal: "principal",
        credentials: yield signedHeader({ region, port, serviceName, protocol, host, hostPort })
    };
    return neo4j_driver_1.default.driver(url, authToken, {
        encrypted: "ENCRYPTION_ON",
        trust: "TRUST_SYSTEM_CA_SIGNED_CERTIFICATES",
        maxConnectionPoolSize: info.maxConnectionPoolSize
    });
});
class DatabaseManagement {
    constructor(config) {
        const driver = createDriver(config);
        return connector.NeptuneConnection.getConnectionInstance(driver, config);
    }
    static getInstance(config) {
        if (DatabaseManagement._instance) {
            return DatabaseManagement._instance;
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
exports.default = neo4j_driver_1.default;
