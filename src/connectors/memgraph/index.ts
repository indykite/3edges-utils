
import neo4j from "neo4j-driver";
import * as connector from "../neo4j/connector";
import * as formatter from "../neo4j/formatter";
import { DbProperties, Neo4jCallback, ObjectType } from "../neo4j/types";
import * as unique from "../neo4j/unique";
// import { add, read, remove, startGremlin } from "./gremlin";

export class DatabaseManagement {
    private static _instance: DatabaseManagement;

    constructor(config: DbProperties) {
        return connector.Neo4jConnection.getConnectionInstance(config)
    }

    public static getInstance(config: DbProperties): DatabaseManagement {
        if (DatabaseManagement._instance) {
            return DatabaseManagement._instance
        }

        DatabaseManagement._instance = new DatabaseManagement(config);
        return DatabaseManagement._instance
    }
}

const useFormatter = formatter
const uniqueConnector = unique

export default neo4j;
export { uniqueConnector, useFormatter };
export type { Neo4jCallback, ObjectType };
// export { add, onLoad, read, remove, uniqueConnector, useFormatter };
