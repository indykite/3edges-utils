import { DbProperties } from '../neo4j/types';
declare const startGremlin: (info: DbProperties) => void;
declare const read: (entity: any) => any;
declare const add: (entity: any, properties: any) => void;
declare const remove: (key: any, value: any) => any;
export { add, read, remove, startGremlin };
