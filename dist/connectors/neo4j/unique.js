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
exports.close = exports.runQuery = exports.neo4jConnector = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const neo4j_driver_1 = __importDefault(require("neo4j-driver"));
const neo4jConnector = ({ host, database, username, password }) => {
    try {
        console.log(1, { host, database, username, password });
        const driver = neo4j_driver_1.default.driver(host, neo4j_driver_1.default.auth.basic(username, password));
        return { driver, database };
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.neo4jConnector = neo4jConnector;
const runQuery = (connector, query, params) => __awaiter(void 0, void 0, void 0, function* () {
    const { driver, database } = connector;
    const session = yield driver.session({ database });
    try {
        return yield session.run(query, params);
    }
    catch (error) {
        console.log(2, query, params);
        throw new Error(error);
    }
    finally {
        yield session.close();
    }
});
exports.runQuery = runQuery;
const close = (connector) => __awaiter(void 0, void 0, void 0, function* () {
    const { driver } = connector;
    yield driver.close();
});
exports.close = close;
