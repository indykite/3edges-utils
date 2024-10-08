/* eslint-disable @typescript-eslint/no-explicit-any */
import { Driver, QueryResult } from "neo4j-driver";
import { DbProperties } from "../neo4j/types";

export class NeptuneConnection {
    private static instance: NeptuneConnection;
    private driver: Driver;
    private sessionOptions: any;

    private constructor(driver: Driver, config: DbProperties) {
        this.driver = driver;
        this.sessionOptions = config;
    }

    public static getConnectionInstance(driver: Driver, config: DbProperties): NeptuneConnection {
        return NeptuneConnection.instance ? NeptuneConnection.instance : new NeptuneConnection(driver, config);
    }

    public async runQuery(query: string, parameters: any): Promise<QueryResult | any> {
        // const startQuery = Date.now()
        const session = await this.driver.session(this.sessionOptions);

        const response = await session.run(query, parameters).catch((error) => {
            throw new Error(error.message);
        });
        // const endQuery = Date.now()

        // printTimestamp(startQuery, endQuery, query, parameters)
        return response
    }

    public close(): Promise<void> {
        return this.driver.close();
    }
}
