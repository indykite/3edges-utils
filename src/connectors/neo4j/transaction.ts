/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryResult, Session } from "neo4j-driver";
import TransactionPromise from 'neo4j-driver-core/types/transaction-promise';
import { Neo4jConnection } from "./connector";
import { ObjectType } from "./types";

export class Neo4jTransaction {
    private connection: Neo4jConnection;
    private session: Session;
    private transaction: TransactionPromise;

    public constructor(connection: Neo4jConnection) {
        if (!this.connection) {
            this.connection = connection;
            this.session = connection.driver.session(connection.config);
        }

        if (!this.transaction) {
            this.transaction = this.session.beginTransaction();
        }
    }

    public async checkConnection(): Promise<boolean>
    {
        const session = await this.connection.driver.session(this.connection.config);
        const newTransaction = await session.beginTransaction();

        try {
            await newTransaction.run("MATCH (n) RETURN n LIMIT 1", {});
            await newTransaction.commit()
        } catch {
            return false
        } finally {
            await newTransaction.close();
        }

        return true
    }

    public async runQuery(query: string, parameters: ObjectType): Promise<QueryResult | any>
    {
        // const startQuery = Date.now()
        const response = await this.transaction.run(query, parameters);
        // const endQuery = Date.now()

        // printTimestamp(startQuery, endQuery, query, parameters)
        return response
    }

    public async rollback(): Promise<void> {
        await this.transaction.rollback();
    }

    public async commit(): Promise<void> {
        await this.transaction.commit();
    }

    public async close(): Promise<void> {
        await this.transaction.close();
    }

}
