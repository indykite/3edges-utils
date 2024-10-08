"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsMgr = void 0;
const prom = __importStar(require("prom-client"));
const prom_client_1 = require("prom-client");
/**
 * Singleton utility class for creating and managing Metrics.
 */
class MetricsMgr {
    constructor() {
        this._registry = new prom.Registry();
        this._Counters = new Map();
        this._CounterValues = new Map();
        this._Gauges = new Map();
        this._GaugeValues = new Map();
        this._Histograms = new Map();
    }
    /**
     * Returns an instance of the Metrics Manager
     * @constructor
     */
    static get Instance() {
        return MetricsMgr._instance || (MetricsMgr._instance = new MetricsMgr());
    }
    /**
     * Returns the instance of the metrics registry
     * @constructor
     */
    get Registry() {
        return this._registry;
    }
    /**
     * Creates a new counter with the provided name and initializes it
     * @param cName The Counter label
     * @param cHelp The Counter's Help text
     */
    createCounter(cName, cHelp) {
        // Counter values
        this._CounterValues.set(cName, 0);
        // Prometheus counters
        this._Counters.set(cName, new prom.Counter({
            name: cName,
            help: cHelp
        }));
    }
    /**
     * Creates a new counter with the provided name and initializes it
     * @param cName The Counter label
     * @param cHelp The Counter's Help text
     * @param cLabels An array of label strings; e.g. ['code','test']
     */
    createCounterWithLabels(cName, cHelp, cLabels) {
        // Counter values
        this._CounterValues.set(cName, 0);
        // Prometheus counters
        this._Counters.set(cName, new prom.Counter({
            name: cName,
            help: cHelp,
            labelNames: cLabels
        }));
    }
    /**
     * Increment a counter by a given value
     * @param cName The name of the counter to increment
     * @param val the value to increment it by
     * @param label: Optional - the label of the counter to increment,
     * in the form "{key: value}" - e.g., "{ code: 200 }"
     */
    addToCounter(cName, val, label) {
        // eslint-disable-next-line
        let c = this._Counters.get(cName);
        if (!label)
            c.inc(val);
        else {
            c.inc(label, val);
        }
        this._Counters.set(cName, c);
        this._CounterValues.set(cName, this._CounterValues.get(cName) + val);
    }
    /***
     * Return the given counter
     * @param cName the name of the counter to return
     */
    getCounter(cName) {
        return this._Counters.get(cName);
    }
    /**
     * Resets the given counter
     * @param nName The counter to reset
     */
    resetCounter(nName) {
        this._Counters.get(nName).reset();
        this._CounterValues.set(nName, 0);
    }
    /**
     * Retuns a hashmap of all counters and their values
     * @protected
     */
    getCounterValues() {
        return this._CounterValues;
    }
    /**
     * Returns the value of the given counter
     * @param cName the counter to fetch
     * @protected
     */
    getCounterValue(cName) {
        return this._CounterValues.get(cName);
    }
    /**
     * Creates a new Gauge with the provided name and initializes it
     * @param gName The Gauge label
     * @param gHelp The Gauge's Help text
     */
    createGauge(gName, gHelp) {
        // Counter values
        this._GaugeValues.set(gName, 0);
        // Prometheus counters
        this._Gauges.set(gName, new prom.Gauge({
            name: gName,
            help: gHelp
        }));
    }
    /**
     * Creates a new gauge with the provided name and initializes it
     * @param gName The Gauge label
     * @param gHelp The Gauge's Help text
     * @param gLabels An array of label strings; e.g. ['code','test']
     */
    createGaugeWithLabels(gName, gHelp, gLabels) {
        // Counter values
        this._GaugeValues.set(gName, 0);
        // Prometheus counters
        this._Gauges.set(gName, new prom.Gauge({
            name: gName,
            help: gHelp,
            labelNames: gLabels
        }));
    }
    /**
     * Increment a Gauge by a given value
     * @param gName The name of the counter to increment
     * @param val the value to increment it by
     * @param label: Optional - the label of the counter to increment,
     * in the form "{key: value}" - e.g., "{ code: 200 }"
     */
    addToGauge(gName, val, label) {
        // eslint-disable-next-line
        let c = this._Gauges.get(gName);
        if (!label)
            c.inc(val);
        else {
            c.inc(label, val);
        }
        this._Gauges.set(gName, c);
        this._GaugeValues.set(gName, this._GaugeValues.get(gName) + val);
    }
    /**
     * Decrement a Gauge by a given value
     * @param gName The name of the counter to decrement
     * @param val the value to decrement it by
     * @param label: Optional - the label of the counter to decrement,
     * in the form "{key: value}" - e.g., "{ code: 200 }"
     */
    decGauge(gName, val, label) {
        // eslint-disable-next-line
        let c = this._Gauges.get(gName);
        if (!label)
            c.dec(val);
        else {
            c.dec(label, val);
        }
        this._Gauges.set(gName, c);
        this._GaugeValues.set(gName, this._GaugeValues.get(gName) - val);
    }
    /***
     * Return the given Gauge
     * @param cName the name of the counter to return
     */
    getGauge(gName) {
        return this._Gauges.get(gName);
    }
    /**
     * Retuns a hashmap of all gauges and their values
     * @protected
     */
    getGaugeValues() {
        return this._GaugeValues;
    }
    /**
     * Returns the value of the given gauge
     * @param gName the gauge to fetch
     * @protected
     */
    getGaugeValue(gName) {
        return this._GaugeValues.get(gName);
    }
    /**
     * Resets the given Gauge
     * @param gName The counter to reset
     */
    resetGauge(gName) {
        this._Gauges.get(gName).reset();
        this._GaugeValues.set(gName, 0);
    }
    /**
     * Creates and start a new Timer
     * @param gName The name of the Timer
     */
    startTimer(tName) {
        // Prometheus uses Gauges for timers
        this._Gauges.set(tName, new prom.Gauge({
            name: tName,
            help: "Timer named " + tName
        }));
        // Config timer
        this._Gauges.get(tName).setToCurrentTime();
        // start timer: returns a stop timer `end` function
        return this._Gauges.get(tName).startTimer();
    }
    /**
     * Creates a new Histogram with the provided configuration
     * @param hName The Histogram label
     * @param hHelp The Histogram's Help text
     * @param hLabels Optional - An Array of strings, the labels of the Histogram; e.g., "['Action']"
     * @param hBuckets Optional - An array of numbers; e.g. [0.1, 5, 15, 50, 100, 500] - the
     * buckets of the Histogram
     */
    createHistogram(hName, hHelp, hLabels, hBuckets) {
        // Base Histogram config
        const baseCfg = "{ \"name\": \"".concat(hName).concat("\", \"help\":\"").concat(hHelp).concat("\"}");
        let cfg = JSON.parse(baseCfg);
        // Optional Buckets
        if (hBuckets) {
            cfg = Object.assign(Object.assign({}, cfg), { buckets: hBuckets });
        }
        // Optional Labels
        if (hLabels) {
            cfg = Object.assign(Object.assign({}, cfg), { labelNames: hLabels });
        }
        // Configure Histogram
        this._Histograms.set(hName, new prom.Histogram(cfg));
    }
    /**
     * Makes an observation for the given histogram
     * @param hName The Histogram name
     * @param hValue The value to observe
     */
    observe(hName, hValue, hLabels) {
        if (hLabels) {
            this._Histograms.get(hName).labels(hLabels).observe(hValue);
        }
        else
            this._Histograms.get(hName).observe(hValue);
    }
    /**
     * Returns the given Historgram
     * @param hName the Histogram to fetch
     */
    getHistogram(hName) {
        return this._Histograms.get(hName);
    }
    /**
     * Creates and start a new Timer using an existing Histogram
     * @param hName The name of an existing Histogram to use.
     * @param hLabels The labels of the Histogram
     * @return a function to stop the timer.
     */
    startHistoTimer(hName, hLabels) {
        // start timer: returns a stop timer `end` function
        if (hLabels) {
            return this._Histograms.get(hName).labels(hLabels).startTimer();
        }
        else
            return this._Histograms.get(hName).startTimer();
    }
    /**
     * Creates default metrics to use as a `metrics` endpoint on a NodeJS Server.
     * Prometheus uses the Metrics endpoint to scrape metrics.
     * @param prefix - A prometheus label specific to the calling app, that identified all the metrics of that app
     * pertaining to that app.
     */
    defaultMetrics(prefix) {
        // Collect default metrics
        const collectDefaultMetrics = prom.collectDefaultMetrics;
        collectDefaultMetrics({
            register: prom_client_1.register,
            prefix: prefix,
            labels: { NODE_APP_INSTANCE: process.env.NODE_APP_INSTANCE },
            gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5], // These are the default buckets.
        });
        console.info("Default metrics created.");
        // this._registry.metrics().then(str => console.info(str));
    }
    /**
     * Register the metrics with Prometheus
     */
    register() {
        return __awaiter(this, void 0, void 0, function* () {
            return prom_client_1.register.metrics();
        });
    }
}
exports.MetricsMgr = MetricsMgr;
