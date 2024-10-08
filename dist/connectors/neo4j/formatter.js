"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatArrayResponseLabels = exports.formatOneResponseLabels = exports.formatResFromNeo4jResCount = exports.formatArraySubscriptionResponse = exports.formatSubscriptionResponse = exports.formatCleanResponse = exports.formatArrayResonseWithKeys = exports.formatArrayResponseWithFields = exports.formatArrayResponseForRecordsArray = exports.formatArrayResponse = exports.formatOneResponse = exports.formatOneResponseWithFields = void 0;
function formatOneResponseWithFields(res) {
    return res.records[0] && res.records[0]["_fields"][0];
}
exports.formatOneResponseWithFields = formatOneResponseWithFields;
function formatOneResponse(res) {
    return res.records[0] && res.records[0]["_fields"][0]["properties"];
}
exports.formatOneResponse = formatOneResponse;
function formatArrayResponse(res) {
    return res.records.map((record) => record["_fields"][0]["properties"]);
}
exports.formatArrayResponse = formatArrayResponse;
function formatArrayResponseForRecordsArray(records) {
    return records.map((record) => record["_fields"][0]["properties"]);
}
exports.formatArrayResponseForRecordsArray = formatArrayResponseForRecordsArray;
function formatArrayResponseWithFields(res) {
    return res.records.map((record) => record["_fields"][0]);
}
exports.formatArrayResponseWithFields = formatArrayResponseWithFields;
function formatArrayResonseWithKeys(res) {
    return res.records.map((record) => {
        const retRes = {};
        record["keys"].forEach((key, index) => {
            if (Array.isArray(record["_fields"][index])) {
                retRes[key] = record["_fields"][index].map((subRec) => subRec["properties"]);
            }
            else if (record["_fields"][index]) {
                retRes[key] = record["_fields"][index]["properties"] || record["_fields"][index];
            }
            else {
                retRes[key] = null;
            }
        });
        return retRes;
    });
}
exports.formatArrayResonseWithKeys = formatArrayResonseWithKeys;
function formatCleanResponse(res) {
    return res.records.map((record) => {
        const retRes = {};
        record.keys.forEach((key, index) => {
            retRes[key] = record["_fields"][index];
        });
        return retRes;
    });
}
exports.formatCleanResponse = formatCleanResponse;
function formatSubscriptionResponse(res) {
    const properties = res.records[0] && res.records[0]["_fields"][0]["properties"];
    Object.keys(properties).forEach((key) => {
        if (typeof properties[key] === 'object' && "low" in properties[key] && "high" in properties[key]) {
            properties[key] = properties[key].low;
        }
    });
    return properties;
}
exports.formatSubscriptionResponse = formatSubscriptionResponse;
function formatArraySubscriptionResponse(res) {
    return res.records.map((record) => {
        const properties = record && record["_fields"][0]["properties"];
        Object.keys(properties).forEach((key) => {
            if (typeof properties[key] === 'object' && "low" in properties[key] && "high" in properties[key]) {
                properties[key] = properties[key].low;
            }
        });
        return properties;
    });
}
exports.formatArraySubscriptionResponse = formatArraySubscriptionResponse;
const formatResFromNeo4jResCount = (res) => res && res.records[0] && res.records[0]["_fields"][0]["low"];
exports.formatResFromNeo4jResCount = formatResFromNeo4jResCount;
function formatOneResponseLabels(res) {
    return res.records[0] && res.records[0]["_fields"][0]["labels"];
}
exports.formatOneResponseLabels = formatOneResponseLabels;
function formatArrayResponseLabels(res) {
    return res.records.map((record) => record["_fields"][0]["labels"]);
}
exports.formatArrayResponseLabels = formatArrayResponseLabels;
