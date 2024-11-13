/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unexpected-multiline */
import 'dotenv/config';
import { DbConfiguration } from './DbConfiguration';
import * as cert from "./cert/utils";
import * as memgraph from "./connectors/memgraph";
import * as neo4j from "./connectors/neo4j";
import { Neo4jConnection } from './connectors/neo4j/connector';
import { DbProperties } from './connectors/neo4j/types';
import * as neptune from "./connectors/neptune";
import { NeptuneConnection } from './connectors/neptune/connector';
import console from './console';
import { MetricsMgr } from "./metering";
import * as toastify from "./toastify";
import * as fn from "./utils";

class DbConfigurationMgr {
    private static _instance: any | DbConfigurationMgr | Neo4jConnection | NeptuneConnection

    constructor(config: DbProperties) {
        switch (config.type) {
            case fn.DBtype.memgraph:
                // startGremlin(dbConfig)
                return memgraph.DatabaseManagement.getInstance(config)
            case fn.DBtype.neptune:
                return neptune.DatabaseManagement.getInstance(config)
            default:
                return neo4j.DatabaseManagement.getInstance(config)
        }
    }

    public static getInstance(config: DbProperties) {
        if (DbConfigurationMgr._instance)
        {
            if (config.host === (DbConfigurationMgr._instance as any).config.host
            && config.username === (DbConfigurationMgr._instance as any).config.username
            && config.password === (DbConfigurationMgr._instance as any).config.password
            && config.database === (DbConfigurationMgr._instance as any).config.database)
            {
                return DbConfigurationMgr._instance;
            }
        }

        DbConfigurationMgr._instance = new DbConfigurationMgr(config);
        return DbConfigurationMgr._instance
    }
}

export { cert, console, DbConfiguration, DbConfigurationMgr, DbProperties, fn, memgraph, MetricsMgr, neo4j, neptune, toastify };

