import { DbProperties } from './types';
export declare const neo4jConnector: ({ host, database, username, password }: DbProperties) => any;
export declare const runQuery: (connector: any, query: any, params: any) => Promise<any>;
export declare const close: (connector: any) => Promise<void>;
