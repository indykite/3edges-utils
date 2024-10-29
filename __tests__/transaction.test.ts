/* eslint-disable @typescript-eslint/no-unused-vars */
import { DbConfiguration, DbConfigurationMgr } from "../src";
import { uniqueConnector, useTransaction } from "../src/connectors/neo4j";
import { DbProperties } from "../src/connectors/neo4j/types";

describe("Transaction class", () => {
    it("Running queries", async () => {
        const dbConfig = new DbConfiguration({
            // db
            type: process.env.DB_TYPE,
            version: process.env.DB_VERSION,

            // credentials
            host: process.env.DB_HOST,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,

            // optional
            maxConnectionLifetime: 10000,
            maxConnectionPoolSize: 20000,
            connectionAcquisitionTimeout: 30000,
            connectionTimeout: 40000
        } as DbProperties);

        // 11726 items
        const useConnector = DbConfigurationMgr.getInstance(dbConfig)

        /************************/
        /* Example 1 - by Query */
        /************************/
        const res1QueryConnector = await useConnector.runQuery("match (n) return n limit 10", {});
        const res1Query = await useConnector.runQuery("match (n) return n limit 10", {});
        // console.log(res1QueryConnector.records.length);
        // console.log(res1Query.records.length);

        const res1LegislatorConnector = await useConnector.runQuery("match (n:Legislator) return n", {});
        const res1Legislator = await useConnector.runQuery("match (n:Legislator) return n", {});
        // console.log(res1LegislatorConnector.records.length);
        // console.log(res1Legislator.records.length);

        const res1BillConnector = await useConnector.runQuery("match (n:Bill) return n", {});
        const res1Bill = await useConnector.runQuery("match (n:Bill) return n", {});
        // console.log(res1BillConnector.records.length);
        // console.log(res1Bill.records.length);

        expect(res1Query.records.length).toBeGreaterThan(0);
        // expect(res1Legislator.records.length).toBe(539);
        // expect(res1Bill.records.length).toBe(10223);

        /*********************************/
        /* Example 2 - by useTransaction */
        /*********************************/
        const neo4jUseTransaction = useTransaction(DbConfigurationMgr.getInstance(dbConfig))
        let res3;
        try {
            res3 = await neo4jUseTransaction.runQuery("match (n) return n limit 10", {})
            await neo4jUseTransaction.commit()
        } catch (e) {
            console.log(e);
            await neo4jUseTransaction.rollback()
        } finally {
            await neo4jUseTransaction.close()
        }
        // expect(res3.records.length).toBeGreaterThan(0);

        /**********************************/
        /* Example 3 - by uniqueConnector */
        /**********************************/
        const neo4jUniqueConnector = uniqueConnector.neo4jConnector(dbConfig)

        let res0, res1;
        try {
            res0 = await uniqueConnector.runQuery(neo4jUniqueConnector, "match (n) return n limit 10", {})
            res1 = await uniqueConnector.runQuery(neo4jUniqueConnector, "match (n) return n limit 15", {})
        } catch (e) {
            console.log(e);
        } finally {
            await uniqueConnector.close(neo4jUniqueConnector)
        }
        expect(res0.records.length).toBeGreaterThan(0);
        // expect(res1.records.length).toBeGreaterThan(0);

    });
});
