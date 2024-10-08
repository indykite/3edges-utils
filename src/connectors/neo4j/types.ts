export type Neo4jCallback = (res: unknown) => unknown;

export type ObjectType = Record<string, unknown>;

export interface DbProperties {
    type: string;
    version: string;

    host: string;
    username: string;
    password: string;
    database: string;

    // optional
    connectionTimeout?: number;
    maxConnectionPoolSize?: number;
    maxConnectionLifetime?: number;
    connectionAcquisitionTimeout?: number;
}