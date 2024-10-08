import { edgesDateTime, readConfigMapDir, updateConfigMapDir } from "../src/utils";
import authz from "./etc/config/authz.json";
import dataproxy from "./etc/config/dataproxy.json";

describe("Test Utilities", () => {

    it("Check current date", () => {
        const dt = edgesDateTime();
        expect(dt).toMatch(Date());
    });

    it("Check current date", async () => {
        await updateConfigMapDir('obj_file.json', { "obj_key": "obj_value" }, true, '__tests__/etc/config');

        const configMapProperties: any = await readConfigMapDir('__tests__/etc/config');

        expect(configMapProperties.authz).toMatchObject(authz);
        expect(configMapProperties.dataproxy).toMatchObject(dataproxy);

        expect(configMapProperties.dataproxy.MAX_TROTTLE_COST).toBe(12345678);
        expect(configMapProperties.authz.apiKey).toBe('1ee3b46b747f4bae8ec05e0cc75c486ea2a90df8aab64901bfeccdd2b76fb421cac4277ff0a040e0a0f2327b9ff9cca3');
    });
});
