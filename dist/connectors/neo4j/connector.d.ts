import { Driver, QueryResult } from "neo4j-driver";
import { DbProperties, ObjectType } from "./types";
export declare class Neo4jConnection {
    private static instance;
    readonly driver: Driver;
    readonly config: DbProperties;
    private constructor();
    static getConnectionInstance(config: DbProperties): Neo4jConnection;
    runQuery(query: string, parameters: ObjectType): Promise<QueryResult | any>;
    close(): Promise<void>;
}
