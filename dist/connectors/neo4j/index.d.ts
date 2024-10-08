import neo4j from "neo4j-driver";
import * as formatter from "./formatter";
import * as transaction from "./transaction";
import { DbProperties, Neo4jCallback, ObjectType } from "./types";
import * as unique from "./unique";
export declare class DatabaseManagement {
    private static _instance;
    constructor(config: DbProperties);
    static getInstance(config: DbProperties): DatabaseManagement;
}
declare const useFormatter: typeof formatter;
declare const uniqueConnector: typeof unique;
declare const useTransaction: (neo4jConnection: any) => transaction.Neo4jTransaction;
export default neo4j;
export { uniqueConnector, useFormatter, useTransaction };
export type { Neo4jCallback, ObjectType };
