/* eslint-disable @typescript-eslint/no-explicit-any */
import neo4j from 'neo4j-driver';
import { DbProperties } from './types';

export const neo4jConnector = ({ host, database, username, password }: DbProperties): any => {
    try {
        const driver = neo4j.driver(host, neo4j.auth.basic(username, password));
        return { driver, database };
    } catch (error: any) {
        throw new Error(error);
    }
};

export const runQuery = async (connector, query, params) => {
    const { driver, database } = connector;
    const session = await driver.session({ database });

    try {
        return await session.run(query, params);
    } catch (error) {
        throw new Error(error);
    } finally {
        await session.close();
    }
};

export const close = async (connector) => {
    const { driver } = connector;
    await driver.close();
};
