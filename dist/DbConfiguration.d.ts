import { DbProperties } from "./connectors/neo4j/types";
export declare class DbConfiguration implements DbProperties {
    type: string;
    version: string;
    host: string;
    username: string;
    password: string;
    database: string;
    connectionTimeout?: number;
    maxConnectionPoolSize?: number;
    maxConnectionLifetime?: number;
    connectionAcquisitionTimeout?: number;
    constructor({ type, version, host, username, password, database, connectionTimeout, maxConnectionPoolSize, maxConnectionLifetime, connectionAcquisitionTimeout }: DbProperties);
}
