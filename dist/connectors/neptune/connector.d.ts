import { Driver, QueryResult } from "neo4j-driver";
import { DbProperties } from "../neo4j/types";
export declare class NeptuneConnection {
    private static instance;
    private driver;
    private sessionOptions;
    private constructor();
    static getConnectionInstance(driver: Driver, config: DbProperties): NeptuneConnection;
    runQuery(query: string, parameters: any): Promise<QueryResult | any>;
    close(): Promise<void>;
}
