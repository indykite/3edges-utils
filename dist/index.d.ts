import 'dotenv/config';
import { DbConfiguration } from './DbConfiguration';
import * as cert from "./cert/utils";
import * as memgraph from "./connectors/memgraph";
import * as neo4j from "./connectors/neo4j";
import { DbProperties } from './connectors/neo4j/types';
import * as neptune from "./connectors/neptune";
import console from './console';
import { MetricsMgr } from "./metering";
import * as toastify from "./toastify";
import * as fn from "./utils";
declare class DbConfigurationMgr {
    private static _instance;
    constructor(config: DbProperties);
    static getInstance(config: DbProperties): any;
}
export { DbConfiguration, DbConfigurationMgr, DbProperties, MetricsMgr, cert, console, fn, memgraph, neo4j, neptune, toastify };
