"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startGremlin = exports.remove = exports.read = exports.add = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const gremlin_1 = __importDefault(require("gremlin"));
const DriverRemoteConnection = gremlin_1.default.driver.DriverRemoteConnection;
const Graph = gremlin_1.default.structure.Graph;
const graph = new Graph();
let dc, g;
const startGremlin = (info) => {
    dc = new DriverRemoteConnection(`wss://${info.host}:8182/gremlin`, {});
    g = graph.traversal().withRemote(dc);
};
exports.startGremlin = startGremlin;
const read = (entity) => {
    return g.V().hasLabel(entity).toList();
};
exports.read = read;
const add = (entity, properties) => {
    const { id, name } = properties;
    g.addV(entity)
        .property('id', id)
        .property('name', name)
        .iterate();
};
exports.add = add;
const remove = (key, value) => {
    return g.V().has(key, value).drop();
};
exports.remove = remove;
