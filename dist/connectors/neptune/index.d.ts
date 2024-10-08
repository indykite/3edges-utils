import neo4j from "neo4j-driver";
import * as formatter from "../neo4j/formatter";
import { DbProperties, Neo4jCallback, ObjectType } from "../neo4j/types";
import * as unique from "../neo4j/unique";
export declare class DatabaseManagement {
    private static _instance;
    constructor(config: DbProperties);
    static getInstance(config: DbProperties): DatabaseManagement;
}
declare const useFormatter: typeof formatter;
declare const uniqueConnector: typeof unique;
export default neo4j;
export { uniqueConnector, useFormatter };
export type { Neo4jCallback, ObjectType };
