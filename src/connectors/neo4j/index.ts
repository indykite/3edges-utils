import neo4j from "neo4j-driver";
import * as connector from "./connector";
import * as formatter from "./formatter";
import * as transaction from "./transaction";
import { DbProperties, Neo4jCallback, ObjectType } from "./types";
import * as unique from "./unique";

export class DatabaseManagement {
    private static _instance: DatabaseManagement;

    constructor(config: DbProperties) {
        return connector.Neo4jConnection.getConnectionInstance(config)
    }

    public static getInstance(config: DbProperties): DatabaseManagement {
        if (DatabaseManagement._instance)
        {
            if (config.host === (DatabaseManagement._instance as any).config.host
                && config.username === (DatabaseManagement._instance as any).config.username
                && config.password === (DatabaseManagement._instance as any).config.password
                && config.database === (DatabaseManagement._instance as any).config.database)
            {
                return DatabaseManagement._instance
            }
        }

        DatabaseManagement._instance = new DatabaseManagement(config);
        return DatabaseManagement._instance
    }
}

const useFormatter = formatter
const uniqueConnector = unique

const useTransaction = (neo4jConnection) => {
    return new transaction.Neo4jTransaction(neo4jConnection)
}

export default neo4j;
export { uniqueConnector, useFormatter, useTransaction };
export type { Neo4jCallback, ObjectType };

