import { QueryResult } from "neo4j-driver";
import { Neo4jConnection } from "./connector";
import { ObjectType } from "./types";
export declare class Neo4jTransaction {
    private connection;
    private session;
    private transaction;
    constructor(connection: Neo4jConnection);
    checkConnection(): Promise<boolean>;
    runQuery(query: string, parameters: ObjectType): Promise<QueryResult | any>;
    rollback(): Promise<void>;
    commit(): Promise<void>;
    close(): Promise<void>;
}
