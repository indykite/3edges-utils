/* eslint-disable @typescript-eslint/no-explicit-any */
import gremlin from 'gremlin';
import { DbProperties } from '../neo4j/types';

const DriverRemoteConnection = gremlin.driver.DriverRemoteConnection;
const Graph = gremlin.structure.Graph;
const graph = new Graph();

let dc, g;

const startGremlin = (info: DbProperties) => {
    dc = new DriverRemoteConnection(`wss://${info.host}:8182/gremlin`, {});
    g = graph.traversal().withRemote(dc);
}

const read = (entity) => {
    return g.V().hasLabel(entity).toList()
}

const add = (entity, properties) => {
    const { id, name } = properties

    g.addV(entity)
        .property('id', id)
        .property('name', name)
    .iterate()
}

const remove = (key, value) => {
    return g.V().has(key, value).drop()
}

export { add, read, remove, startGremlin };
