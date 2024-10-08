/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryResult } from "neo4j-driver";

export function formatOneResponseWithFields(res: QueryResult): any {
    return res.records[0] && res.records[0]["_fields"][0];
}

export function formatOneResponse(res: QueryResult): any
{
    return res.records[0] && res.records[0]["_fields"][0]["properties"];
}

export function formatArrayResponse(res: QueryResult): any[] {
    return res.records.map((record) => record["_fields"][0]["properties"]);
}

export function formatArrayResponseForRecordsArray(records: any): any[] {
    return records.map((record) => record["_fields"][0]["properties"]);
}

export function formatArrayResponseWithFields(res: QueryResult): any[] {
    return res.records.map((record) => record["_fields"][0]);
}

export function formatArrayResonseWithKeys(res: QueryResult): any[] {
    return res.records.map((record) => {

        const retRes = {};
        record["keys"].forEach((key, index) => {
            if (Array.isArray(record["_fields"][index])) {
                retRes[key] = record["_fields"][index].map((subRec) => subRec["properties"]);
            } else if (record["_fields"][index]) {
                retRes[key] = record["_fields"][index]["properties"] || record["_fields"][index];
            } else {
                retRes[key] = null;
            }
        });

        return retRes;
    });
}

export function formatCleanResponse(res: QueryResult): any[] {
    return res.records.map((record) => {
        const retRes = {};
        record.keys.forEach((key, index) => {
            retRes[key] = record["_fields"][index];
        });

        return retRes;
    });
}

export function formatSubscriptionResponse(res: QueryResult): any {
    const properties = res.records[0] && res.records[0]["_fields"][0]["properties"];
    Object.keys(properties).forEach((key) => {
        if (typeof properties[key] === 'object' && "low" in properties[key] && "high" in properties[key]) {
            properties[key] = properties[key].low;
        }
    });


    return properties;
}

export function formatArraySubscriptionResponse(res: QueryResult): any {
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

export const formatResFromNeo4jResCount = (res) => res && res.records[0] && res.records[0]["_fields"][0]["low"];

export function formatOneResponseLabels(res: QueryResult): any {
    return res.records[0] && res.records[0]["_fields"][0]["labels"];
}

export function formatArrayResponseLabels(res: QueryResult): any[] {
    return res.records.map((record) => record["_fields"][0]["labels"]);
}
