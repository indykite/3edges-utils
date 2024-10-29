import { MetricsMgr } from "../src/metering";

let mMgr: MetricsMgr;
let registry : MetricsMgr["Registry"];

beforeAll(() => {
    mMgr = MetricsMgr.Instance;
    registry = mMgr.Registry;
});
//---------------------------------------------------------
describe("Test Metring Manager Class", () => {
    it("Test Singleton", () => {
        expect(registry.metrics()).toBeTruthy();
    });
});
//---------------------------------------------------------
describe("Test counters", () => {
    it ("Create Counters", async () => {
        mMgr.createCounter("cTest1", "Test counter 1");
        mMgr.createCounterWithLabels("cTest2", "Test counter 2", ["code"]);
        console.log(await mMgr.register());
        expect(mMgr.getCounterValue("cTest1")).toBe(0);
        expect(mMgr.getCounterValue("cTest2")).toBe(0);
    });

    it ("Increment Counters", async () => {
        mMgr.addToCounter("cTest1", 5);
        mMgr.addToCounter("cTest2", 10, {code: 200})
        mMgr.addToCounter("cTest2", 11, {code: 300})
        console.log(await mMgr.register());
        expect(mMgr.getCounterValue("cTest1")).toBe(5);
        // The counter automatically adds the values of all its labeled subcomponents.
        // I.e., here 10{code: 200} + 11{Code:300} = 21
        expect(mMgr.getCounterValue("cTest2")).toBe(21);
    });

    it ("Reset counter", async () => {
        mMgr.resetCounter("cTest1");
        console.log(await mMgr.register());
        expect(mMgr.getCounterValue("cTest1")).toBe(0);
        expect(mMgr.getCounterValue("cTest2")).toBe(21);
    });
});
//---------------------------------------------------------
describe("Test gauges", () => {
    it ("Create Gauges", async () => {
        mMgr.createGauge("gTest1", "Test gauge 1");
        mMgr.createGaugeWithLabels("gTest2", "Test gauge 2", ["system"]);
        console.log(await mMgr.register());
        expect(mMgr.getGaugeValue("gTest1")).toBe(0);
        expect(mMgr.getGaugeValue("gTest2")).toBe(0);
    });

    it ("Increment Gauges", async () => {
        mMgr.addToGauge("gTest1", 7);
        mMgr.addToGauge("gTest2", 13, {system: "dec-01"})
        console.log(await mMgr.register());
        expect(mMgr.getGaugeValue("gTest1")).toBe(7);
        expect(mMgr.getGaugeValue("gTest2")).toBe(13);
    });

    it ("Increment Gauges again", async () => {
        mMgr.addToGauge("gTest1", 3);
        mMgr.addToGauge("gTest2", 7, {system: "dec-01"})
        console.log(await mMgr.register());
        expect(mMgr.getGaugeValue("gTest1")).toBe(10);
        expect(mMgr.getGaugeValue("gTest2")).toBe(20);
    });

    it ("Decrement Gauges", async () => {
        mMgr.decGauge("gTest1", 6);
        mMgr.decGauge("gTest2", 4, {system: "dec-01"})
        console.log(await mMgr.register());
        expect(mMgr.getGaugeValue("gTest1")).toBe(4);
        expect(mMgr.getGaugeValue("gTest2")).toBe(16);
    });

    it ("Reset Gauge", async () => {
        mMgr.resetGauge("gTest1");
        console.log(await mMgr.register());
        expect(mMgr.getGaugeValue("gTest1")).toBe(0);
        expect(mMgr.getGaugeValue("gTest2")).toBe(16)
    });
});
//---------------------------------------------------------
describe("Test Timers", () => {

    it (" Create Timer", async () => {
        const stopTimer = mMgr.startTimer("TimerTest1");
        // Wait
        for (let i=0;i<20000;i++);
        stopTimer();
        console.log(await mMgr.register());
        expect(mMgr.getGauge("TimerTest1")).toBeTruthy();
    });
});
//---------------------------------------------------------
describe("Test Histograms", () => {

    it ("Create Histogram", async () => {
        mMgr.createHistogram("hTest1", "Histo Test1");
        mMgr.createHistogram("hTest2", "Histo Test2 with labels", ["Action"]);
        mMgr.createHistogram("hTest3", "Histo Test3 with Buckets",[], [0.1, 5, 15, 50, 100, 500]);
        mMgr.createHistogram("hTest4", "Histo Test4 with Labels and Buckets",["Action"], [0.1, 5, 15, 50, 100, 500]);
        console.log(await mMgr.register());
        expect(mMgr.getHistogram("hTest4")).toBeTruthy();
    });

    it ("Observe", async() => {
        mMgr.observe("hTest1", 10);
        mMgr.observe("hTest2", 15, "READ");
        mMgr.observe("hTest3", 75);
        mMgr.observe("hTest4", 98, "WRITE");
        //console.log(await register.metrics());
        console.log(await mMgr.register());
        expect(mMgr.getHistogram("hTest4")).toBeTruthy();
    });

    it (" Create Histogram Timer", async () => {
        mMgr.createHistogram("hTimerTest", "Histo Timer Test");
        const stopTimer = mMgr.startHistoTimer("hTimerTest");
        // Wait
        for (let i=0;i<20000;i++);
        stopTimer();
        //console.log(await register.metrics());
        console.log(await mMgr.register());
        expect(mMgr.getHistogram("hTimerTest")).toBeTruthy();
    });
});
