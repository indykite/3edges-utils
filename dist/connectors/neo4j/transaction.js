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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Neo4jTransaction = void 0;
class Neo4jTransaction {
    constructor(connection) {
        if (!this.connection) {
            this.connection = connection;
            this.session = connection.driver.session(connection.config);
        }
        if (!this.transaction) {
            this.transaction = this.session.beginTransaction();
        }
    }
    checkConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield this.connection.driver.session(this.connection.config);
            const newTransaction = yield session.beginTransaction();
            try {
                yield newTransaction.run("MATCH (n) RETURN n LIMIT 1", {});
                yield newTransaction.commit();
            }
            catch (_a) {
                return false;
            }
            finally {
                yield newTransaction.close();
            }
            return true;
        });
    }
    runQuery(query, parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            // const startQuery = Date.now()
            const response = yield this.transaction.run(query, parameters);
            // const endQuery = Date.now()
            // printTimestamp(startQuery, endQuery, query, parameters)
            return response;
        });
    }
    rollback() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.transaction.rollback();
        });
    }
    commit() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.transaction.commit();
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.transaction.close();
        });
    }
}
exports.Neo4jTransaction = Neo4jTransaction;
