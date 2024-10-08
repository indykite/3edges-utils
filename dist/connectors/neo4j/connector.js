"use strict";
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
exports.Neo4jConnection = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const neo4j_driver_1 = __importDefault(require("neo4j-driver"));
class Neo4jConnection {
    constructor(config) {
        this.driver = neo4j_driver_1.default.driver(config.host, neo4j_driver_1.default.auth.basic(config.username, config.password), config);
        this.config = config;
    }
    static getConnectionInstance(config) {
        if (Neo4jConnection.instance) {
            if (config.host === Neo4jConnection.instance.config.host && config.database === Neo4jConnection.instance.config.database) {
                return Neo4jConnection.instance;
            }
        }
        Neo4jConnection.instance = new Neo4jConnection(config);
        return Neo4jConnection.instance;
    }
    runQuery(query, parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            // const startQuery = Date.now()
            const session = yield this.driver.session(this.config);
            const response = yield session
                .run(query, parameters)
                .catch((error) => {
                throw new Error(error.message);
            })
                .finally(() => session.close());
            // const endQuery = Date.now()
            // printTimestamp(startQuery, endQuery, query, parameters)
            return response;
        });
    }
    close() {
        return this.driver.close();
    }
}
exports.Neo4jConnection = Neo4jConnection;
