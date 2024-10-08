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
exports.NeptuneConnection = void 0;
class NeptuneConnection {
    constructor(driver, config) {
        this.driver = driver;
        this.sessionOptions = config;
    }
    static getConnectionInstance(driver, config) {
        return NeptuneConnection.instance ? NeptuneConnection.instance : new NeptuneConnection(driver, config);
    }
    runQuery(query, parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            // const startQuery = Date.now()
            const session = yield this.driver.session(this.sessionOptions);
            const response = yield session.run(query, parameters).catch((error) => {
                throw new Error(error.message);
            });
            // const endQuery = Date.now()
            // printTimestamp(startQuery, endQuery, query, parameters)
            return response;
        });
    }
    close() {
        return this.driver.close();
    }
}
exports.NeptuneConnection = NeptuneConnection;
