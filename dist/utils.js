"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateConfigMapDir = exports.readConfigMapDir = exports.isNotEmpty = exports.isEmpty = exports.genRanHex = exports.stringToBase64 = exports.base64ToString = exports.compareNeo4jVersion = exports.isTrue = exports.isFalse = exports.decryptText = exports.encryptText = exports.getFormattedUrl = exports.generateRandomString = exports.decryptSecretAES = exports.encryptSecretAES = exports.sendEmailFunc = exports.randomKey = exports.checkEmailFormat = exports.formatDate = exports.getFormattedCookie = exports.getCookie = exports.isLocalhost = exports.isUndefined = exports.isWebLocalhost = exports.capitalizeFirstLetter = exports.sleepFor = exports.isValidUrl = exports.isValidConnectionUrl = exports.base64_decode = exports.base64_encode = exports.claim = exports.client_credentials = exports.printTimestamp = exports.DBtype = exports.isJson = exports.edgesDateTime = void 0;
/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-explicit-any */
const axios_1 = __importDefault(require("axios"));
const crypto_1 = __importDefault(require("crypto"));
const crypto_js_1 = __importDefault(require("crypto-js"));
require("dotenv/config");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const querystring_1 = __importDefault(require("querystring"));
const console_1 = __importDefault(require("./console"));
const edgesDateTime = () => Date();
exports.edgesDateTime = edgesDateTime;
const isJson = (str) => {
    try {
        JSON.parse(str);
    }
    catch (_a) {
        return false;
    }
    return true;
};
exports.isJson = isJson;
var DBtype;
(function (DBtype) {
    DBtype["neo4j"] = "neo4j";
    DBtype["memgraph"] = "memgraph";
    DBtype["arangodb"] = "arangodb";
    DBtype["orientdb"] = "orientdb";
    DBtype["neptune"] = "neptune";
    DBtype["dgraph"] = "dgraph";
})(DBtype || (exports.DBtype = DBtype = {}));
const printTimestamp = (startQuery, endQuery, query, parameters) => {
    console_1.default.info("Query:", query);
    console_1.default.info("Parameters:", parameters);
    console_1.default.info("Timestamp:", (endQuery - startQuery), "ms");
};
exports.printTimestamp = printTimestamp;
const client_credentials = (credentialsUrl, serverClientSecret) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield axios_1.default.post(credentialsUrl, querystring_1.default.stringify({ grant_type: 'client_credentials' }), {
            headers: {
                Authorization: `Basic ${serverClientSecret}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return res.data;
    }
    catch (error) {
        return error;
    }
});
exports.client_credentials = client_credentials;
const claim = (introspectionUrl, serverClientSecret, token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield axios_1.default.post(introspectionUrl, querystring_1.default.stringify({ token }), {
            headers: {
                Authorization: `Basic ${serverClientSecret}`,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        return res.data;
    }
    catch (error) {
        throw new Error(error);
    }
});
exports.claim = claim;
const base64_encode = (s) => {
    return btoa(unescape(encodeURIComponent(s)));
};
exports.base64_encode = base64_encode;
const base64_decode = (s) => {
    try {
        return decodeURIComponent(escape(atob(s)));
    }
    catch (_a) { }
};
exports.base64_decode = base64_decode;
const isValidConnectionUrl = (urlString) => {
    try {
        const url = new URL(urlString);
        if (!url.protocol.includes("http")) {
            return false;
        }
        return true;
    }
    catch (_a) {
        return false;
    }
};
exports.isValidConnectionUrl = isValidConnectionUrl;
const isValidUrl = (urlString) => {
    const urlPattern = new RegExp('^(https?:\\/\\/)' + // validate protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // validate fragment locator
    let response = !!urlPattern.test(urlString);
    if (!response && urlString.includes("localhost")) {
        response = (0, exports.isValidConnectionUrl)(urlString);
    }
    return response;
};
exports.isValidUrl = isValidUrl;
const sleepFor = (seconds) => {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
};
exports.sleepFor = sleepFor;
const capitalizeFirstLetter = (value) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
};
exports.capitalizeFirstLetter = capitalizeFirstLetter;
const isWebLocalhost = () => Boolean(window.location.hostname === "localhost" ||
    window.location.hostname === "[::1]" ||
    /^127(?:\.(?:25[0-5]|2[0-4]\d|[01]?\d{1,2})){3}$/.test(window.location.hostname));
exports.isWebLocalhost = isWebLocalhost;
const isUndefined = (value) => typeof value === "undefined";
exports.isUndefined = isUndefined;
const isLocalhost = (value) => Boolean(value === "localhost");
exports.isLocalhost = isLocalhost;
const getCookie = (cookies, key) => {
    const nameEQ = `${key}=`;
    const ca = (cookies === null || cookies === void 0 ? void 0 : cookies.split(";")) || [];
    for (let c of ca) {
        while (c.startsWith(" ")) {
            c = c.slice(1, c.length);
        }
        if (c.startsWith(nameEQ)) {
            return c.slice(nameEQ.length, c.length);
        }
    }
    return null;
};
exports.getCookie = getCookie;
const getFormattedCookie = (cookies, key) => {
    let value = cookies[key];
    value = decodeURIComponent(value);
    if ((0, exports.isNotEmpty)(value)) {
        try {
            return JSON.parse(value);
        }
        catch (_a) {
            return value;
        }
    }
    return null;
};
exports.getFormattedCookie = getFormattedCookie;
const formatDate = (value) => {
    const d = new Date(value);
    const day = d.getDate();
    const dayOnWeek = d.getDay();
    const month = d.getMonth();
    const year = d.getFullYear();
    const h = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
    const m = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
    const s = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
    const p = d.getHours() >= 12 ? "PM" : "AM";
    const dayString = ['', 'st', 'nd', 'rd'];
    const weekString = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthString = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${weekString[dayOnWeek]}, ${monthString[month]} ${day}${dayString[day] || 'th'}, ${year}, ${h}:${m}:${s} ${p}`;
};
exports.formatDate = formatDate;
const checkEmailFormat = (value) => (/^[\w.-]+@[\dA-Za-z-]+\.[\d.A-Za-z-]+$/gu).test(value);
exports.checkEmailFormat = checkEmailFormat;
const randomKey = () => `rKEY_${(0, exports.generateRandomString)()}`;
exports.randomKey = randomKey;
const sendEmailFunc = (secret, mailInfo) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const serviceOnline = yield axios_1.default.get(process.env.SEND_EMAIL_URL);
        if (serviceOnline.status === 200 && secret) {
            const params = {
                from: {
                    email: process.env.SEND_EMAIL_FROM,
                    name: process.env.SEND_EMAIL_FROM_NAME
                },
                to: {
                    email: mailInfo.to.email,
                    name: (_a = mailInfo.to) === null || _a === void 0 ? void 0 : _a.name
                },
                subject: mailInfo.subject,
                text: mailInfo.text,
                html: mailInfo.html
            };
            yield axios_1.default.post(`${process.env.SEND_EMAIL_URL}/sendEmail`, params, {
                headers: {
                    'x-stats': crypto_js_1.default.AES.encrypt(secret, process.env.INTERNAL_SECRET),
                    'x-server': crypto_js_1.default.AES.encrypt(process.env.SEND_EMAIL_SERVER, process.env.INTERNAL_SECRET)
                }
            });
            return true;
        }
        return false;
    }
    catch (error) {
        return false;
    }
});
exports.sendEmailFunc = sendEmailFunc;
const encryptSecretAES = (text, CLIENT_SECRET_ENC_KEY) => {
    const IV_LENGTH = 16;
    const ENCRYPTION_KEY = Buffer.from(CLIENT_SECRET_ENC_KEY, 'hex');
    const iv = crypto_1.default.randomBytes(IV_LENGTH);
    const cipher = crypto_1.default.createCipheriv('aes-128-cbc', ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};
exports.encryptSecretAES = encryptSecretAES;
const decryptSecretAES = (text, CLIENT_SECRET_ENC_KEY) => {
    try {
        const textParts = text.split(':');
        const iv = Buffer.from(textParts.shift(), 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const ENCRYPTION_KEY = Buffer.from(CLIENT_SECRET_ENC_KEY, 'hex');
        const decipher = crypto_1.default.createDecipheriv('aes-128-cbc', ENCRYPTION_KEY, iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
    catch (_a) {
        return null;
    }
};
exports.decryptSecretAES = decryptSecretAES;
const upperLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowerLetters = 'abcdefghijklmnopqrstuvwxyz';
const numbers = '0123456789';
const characters = `${upperLetters}${numbers}${lowerLetters}`;
const generateRandomString = (length = 10) => {
    const lowerLettersLength = lowerLetters.length;
    let result = lowerLetters.charAt(Math.floor(Math.random() * lowerLettersLength));
    const charactersLength = characters.length;
    for (let i = 0; i < length - 1; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result.toLowerCase();
};
exports.generateRandomString = generateRandomString;
const getFormattedUrl = (req) => {
    return req.protocol + '://' + req.get('host') + req.originalUrl;
};
exports.getFormattedUrl = getFormattedUrl;
const encryptText = (value, secret = process.env.INTERNAL_SECRET) => crypto_js_1.default.AES.encrypt(value, secret).toString();
exports.encryptText = encryptText;
const decryptText = (value, secret = process.env.INTERNAL_SECRET) => {
    if ((0, exports.isNotEmpty)(value) && value.startsWith("U2F")) {
        const res = crypto_js_1.default.AES.decrypt(value, secret);
        const response = res.toString(crypto_js_1.default.enc.Utf8);
        return response;
    }
    return value;
};
exports.decryptText = decryptText;
const isFalse = (value) => !(0, exports.isTrue)(value);
exports.isFalse = isFalse;
const isTrue = (value) => {
    if (value === "true" || Boolean(value && typeof value === "boolean")) {
        return true;
    }
    return false;
};
exports.isTrue = isTrue;
const compareNeo4jVersion = (ver1, ver2) => {
    const version1 = ver1.replace("-aura", "").split('.');
    const version2 = ver2.replace("-aura", "").split('.');
    const v10 = version1[0];
    const v11 = version1[1] || 0;
    const v20 = version2[0];
    const v21 = version2[1] || 0;
    ver1 = `${v10}${v11}`;
    ver2 = `${v20}${v21}`;
    return Number(ver1) >= Number(ver2);
};
exports.compareNeo4jVersion = compareNeo4jVersion;
const base64ToString = (code) => Buffer.from(code, "base64").toString("utf8");
exports.base64ToString = base64ToString;
const stringToBase64 = (code) => Buffer.from(code, "utf8").toString("base64");
exports.stringToBase64 = stringToBase64;
const genRanHex = (size) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
exports.genRanHex = genRanHex;
const isEmpty = (value) => {
    if (!value ||
        value === '' ||
        value.length === 0 ||
        value === null ||
        isObjectEmpty(value) ||
        value === undefined ||
        value === 'undefined') {
        return true;
    }
    if (Array.isArray(value)) {
        return value.length === 0;
    }
    if (typeof value === "object") {
        return Object.keys(value).length === 0;
    }
    return false;
};
exports.isEmpty = isEmpty;
const isObjectEmpty = (obj) => {
    for (const prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            return false;
        }
    }
    return JSON.stringify(obj) === JSON.stringify({});
};
const isNotEmpty = (value) => !(0, exports.isEmpty)(value);
exports.isNotEmpty = isNotEmpty;
const readConfigMap = (dir) => __awaiter(void 0, void 0, void 0, function* () {
    const files = [];
    const response = {
        default: {},
        dataproxy: {},
        idp: {},
        authz: {},
        dashboard: {}
    };
    try {
        fs_1.default.readdirSync(dir).forEach(filename => {
            const name = path_1.default.parse(filename).name;
            const ext = path_1.default.parse(filename).ext;
            const filepath = path_1.default.resolve(dir, filename);
            const stat = fs_1.default.statSync(filepath);
            const isFile = stat.isFile();
            if (process.env.NODE_ENV === "test") {
                if (isFile && (ext === '.json' || ext === '.js')) {
                    files.push({
                        filepath, name, ext, stat,
                    });
                }
            }
            else {
                if (isFile) {
                    files.push({
                        filepath, name, ext, stat,
                    });
                }
            }
        });
        files.sort((a, b) => {
            return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
        });
        files.forEach((file) => __awaiter(void 0, void 0, void 0, function* () {
            const content = fs_1.default.readFileSync(file.filepath, { encoding: 'utf8' });
            try {
                response[file.name] = JSON.parse(content);
            }
            catch (_c) {
                response[file.name] = content;
            }
        }));
    }
    catch (_b) { }
    return response;
});
const readConfigMapDir = (dir = 'etc/config') => __awaiter(void 0, void 0, void 0, function* () {
    const properties = yield readConfigMap(dir);
    if (!(0, exports.isEmpty)(properties)) {
        let cm_default = properties.default;
        let cm_dataproxy = properties.dataproxy;
        let cm_idp = properties.idp;
        let cm_authz = properties.authz;
        const cm_dashboard = properties.dashboard;
        try {
            cm_default = JSON.parse(properties.default);
        }
        catch (_d) { }
        try {
            cm_dataproxy = JSON.parse(properties.dataproxy);
        }
        catch (_e) { }
        try {
            cm_idp = JSON.parse(properties.idp);
        }
        catch (_f) { }
        try {
            cm_authz = JSON.parse(properties.authz);
        }
        catch (_g) { }
        return {
            default: cm_default,
            dataproxy: cm_dataproxy,
            idp: cm_idp,
            authz: cm_authz,
            dashboard: cm_dashboard,
        };
    }
    return null;
});
exports.readConfigMapDir = readConfigMapDir;
const updateConfigMapDir = (file, jsonData, asString = true, dir = 'etc/config') => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (asString) {
            yield fs_1.default.promises.writeFile(dir + '/' + file, JSON.stringify(jsonData, null, 4), 'utf8');
        }
        else {
            yield fs_1.default.promises.writeFile(dir + '/' + file, jsonData, 'utf8');
        }
    }
    catch (err) {
        throw new Error(err);
    }
});
exports.updateConfigMapDir = updateConfigMapDir;
