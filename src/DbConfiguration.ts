import { fn } from ".";
import { DbProperties } from "./connectors/neo4j/types";

export class DbConfiguration implements DbProperties {
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

    constructor({ type, version, host, username, password, database, connectionTimeout, maxConnectionPoolSize, maxConnectionLifetime, connectionAcquisitionTimeout }: DbProperties){
        const dbPassDecrypted = password?.startsWith("U2F") ? fn.decryptText(password, process.env.INTERNAL_SECRET) : password;

        this.type = type
        this.version = version

        this.host = host
        this.username = username
        this.password = dbPassDecrypted
        this.database = database

        // optional
        this.connectionTimeout = connectionTimeout
        this.maxConnectionPoolSize = maxConnectionPoolSize
        this.maxConnectionLifetime = maxConnectionLifetime
        this.connectionAcquisitionTimeout = connectionAcquisitionTimeout

        const dbConfig = {
            // db
            type,
            version,

            // credentials
            host,
            username,
            password: dbPassDecrypted,
            database,

            // optional
            connectionTimeout: connectionTimeout ? Number(connectionTimeout) : Number(process.env.NEO4J_CONNECTION_TIMEOUT) || 30000,
            maxConnectionPoolSize: maxConnectionPoolSize ? Number(maxConnectionPoolSize) : Number(process.env.NEO4J_POOL_SIZE) || 300,
            maxConnectionLifetime: maxConnectionLifetime ? Number(maxConnectionLifetime) : Number(process.env.NEO4J_MAX_CONNECTION_LIFETIME) || 3600000,
            connectionAcquisitionTimeout: connectionAcquisitionTimeout ? Number(connectionAcquisitionTimeout) : Number(process.env.NEO4J_CONNECTION_ACQUISITION_TIMEOUT_MS) || 60000
        };

        // console.log({ type, version, host, database });

        return dbConfig;
    }
}