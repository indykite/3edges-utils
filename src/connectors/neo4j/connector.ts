/* eslint-disable @typescript-eslint/no-explicit-any */
import neo4j, { Driver, QueryResult } from "neo4j-driver";
import { DbProperties, ObjectType } from "./types";

export class Neo4jConnection {
    private static instance: Neo4jConnection;
    public readonly driver: Driver;
    public readonly config: DbProperties;

    private constructor(config: DbProperties) {
        this.driver = neo4j.driver(config.host, neo4j.auth.basic(config.username, config.password), config);
        this.config = config;
    }

    public static getConnectionInstance(config: DbProperties): Neo4jConnection {
        if (Neo4jConnection.instance)
        {
            if (config.host === (Neo4jConnection.instance as any).config.host
                && config.username === (Neo4jConnection.instance as any).config.username
                && config.password === (Neo4jConnection.instance as any).config.password
                && config.database === (Neo4jConnection.instance as any).config.database
            )
            {
                return Neo4jConnection.instance
            }
        }

        Neo4jConnection.instance = new Neo4jConnection(config);
        return Neo4jConnection.instance
    }

    public async runQuery(query: string, parameters: ObjectType): Promise<QueryResult | any>
    {
        // const startQuery = Date.now()
        const session = await this.driver.session(this.config);

        const response = await session
            .run(query, parameters)
            .catch((error) => {
                throw new Error(error.message)
            })
            .finally(() => session.close());
        // const endQuery = Date.now()

        // printTimestamp(startQuery, endQuery, query, parameters)
        return response
    }

    public close(): Promise<void> {
        return this.driver.close();
    }
}
