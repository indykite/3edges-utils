import * as prom from "prom-client";
import { Counter, Gauge, Histogram } from "prom-client";
/**
 * Singleton utility class for creating and managing Metrics.
 */
export declare class MetricsMgr {
    private static _instance;
    private readonly _registry;
    private _Counters;
    private readonly _CounterValues;
    private _Gauges;
    private readonly _GaugeValues;
    private _Histograms;
    private constructor();
    /**
     * Returns an instance of the Metrics Manager
     * @constructor
     */
    static get Instance(): MetricsMgr;
    /**
     * Returns the instance of the metrics registry
     * @constructor
     */
    get Registry(): prom.Registry;
    /**
     * Creates a new counter with the provided name and initializes it
     * @param cName The Counter label
     * @param cHelp The Counter's Help text
     */
    createCounter(cName: string, cHelp: string): void;
    /**
     * Creates a new counter with the provided name and initializes it
     * @param cName The Counter label
     * @param cHelp The Counter's Help text
     * @param cLabels An array of label strings; e.g. ['code','test']
     */
    createCounterWithLabels(cName: string, cHelp: string, cLabels: string[]): void;
    /**
     * Increment a counter by a given value
     * @param cName The name of the counter to increment
     * @param val the value to increment it by
     * @param label: Optional - the label of the counter to increment,
     * in the form "{key: value}" - e.g., "{ code: 200 }"
     */
    addToCounter(cName: string, val: number, label?: object): void;
    /***
     * Return the given counter
     * @param cName the name of the counter to return
     */
    getCounter(cName: string): Counter<string>;
    /**
     * Resets the given counter
     * @param nName The counter to reset
     */
    resetCounter(nName: any): void;
    /**
     * Retuns a hashmap of all counters and their values
     * @protected
     */
    getCounterValues(): Map<string, number>;
    /**
     * Returns the value of the given counter
     * @param cName the counter to fetch
     * @protected
     */
    getCounterValue(cName: string): number;
    /**
     * Creates a new Gauge with the provided name and initializes it
     * @param gName The Gauge label
     * @param gHelp The Gauge's Help text
     */
    createGauge(gName: string, gHelp: string): void;
    /**
     * Creates a new gauge with the provided name and initializes it
     * @param gName The Gauge label
     * @param gHelp The Gauge's Help text
     * @param gLabels An array of label strings; e.g. ['code','test']
     */
    createGaugeWithLabels(gName: string, gHelp: string, gLabels: string[]): void;
    /**
     * Increment a Gauge by a given value
     * @param gName The name of the counter to increment
     * @param val the value to increment it by
     * @param label: Optional - the label of the counter to increment,
     * in the form "{key: value}" - e.g., "{ code: 200 }"
     */
    addToGauge(gName: string, val: number, label?: object): void;
    /**
     * Decrement a Gauge by a given value
     * @param gName The name of the counter to decrement
     * @param val the value to decrement it by
     * @param label: Optional - the label of the counter to decrement,
     * in the form "{key: value}" - e.g., "{ code: 200 }"
     */
    decGauge(gName: string, val: number, label?: object): void;
    /***
     * Return the given Gauge
     * @param cName the name of the counter to return
     */
    getGauge(gName: string): Gauge<string>;
    /**
     * Retuns a hashmap of all gauges and their values
     * @protected
     */
    getGaugeValues(): Map<string, number>;
    /**
     * Returns the value of the given gauge
     * @param gName the gauge to fetch
     * @protected
     */
    getGaugeValue(gName: string): number;
    /**
     * Resets the given Gauge
     * @param gName The counter to reset
     */
    resetGauge(gName: any): void;
    /**
     * Creates and start a new Timer
     * @param gName The name of the Timer
     */
    startTimer(tName: string): (labels?: Partial<Record<string, string | number>>) => void;
    /**
     * Creates a new Histogram with the provided configuration
     * @param hName The Histogram label
     * @param hHelp The Histogram's Help text
     * @param hLabels Optional - An Array of strings, the labels of the Histogram; e.g., "['Action']"
     * @param hBuckets Optional - An array of numbers; e.g. [0.1, 5, 15, 50, 100, 500] - the
     * buckets of the Histogram
     */
    createHistogram(hName: string, hHelp: string, hLabels?: string[], hBuckets?: number[]): void;
    /**
     * Makes an observation for the given histogram
     * @param hName The Histogram name
     * @param hValue The value to observe
     */
    observe(hName: string, hValue: number, hLabels?: string): void;
    /**
     * Returns the given Historgram
     * @param hName the Histogram to fetch
     */
    getHistogram(hName: string): Histogram<string>;
    /**
     * Creates and start a new Timer using an existing Histogram
     * @param hName The name of an existing Histogram to use.
     * @param hLabels The labels of the Histogram
     * @return a function to stop the timer.
     */
    startHistoTimer(hName: string, hLabels?: string): (labels?: Partial<Record<string, string | number>>) => void;
    /**
     * Creates default metrics to use as a `metrics` endpoint on a NodeJS Server.
     * Prometheus uses the Metrics endpoint to scrape metrics.
     * @param prefix - A prometheus label specific to the calling app, that identified all the metrics of that app
     * pertaining to that app.
     */
    defaultMetrics(prefix: string): void;
    /**
     * Register the metrics with Prometheus
     */
    register(): Promise<string>;
}
