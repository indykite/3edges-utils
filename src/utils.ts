/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import crypto from "crypto";
import CryptoJS from "crypto-js";
import 'dotenv/config';
import fs from "fs";
import path from "path";
import querystring from "querystring";
import console from "./console";

export const edgesDateTime = () => Date();
export const isJson = (str) => {
    try {
        JSON.parse(str);
    } catch {
        return false;
    }
    return true;
}

export enum DBtype {
    neo4j = 'neo4j',
    memgraph = 'memgraph',
    arangodb = 'arangodb',
    orientdb = 'orientdb',
    neptune = 'neptune',
    dgraph = 'dgraph'
}

export const printTimestamp = (startQuery, endQuery, query, parameters) => {
    console.info("Query:", query);
    console.info("Parameters:", parameters);
    console.info("Timestamp:", (endQuery - startQuery), "ms");
}

export const client_credentials = async (credentialsUrl: string, serverClientSecret: string) => {
    try {
        const res = await axios.post(credentialsUrl, querystring.stringify({ grant_type: 'client_credentials' }), {
            headers: {
                Authorization: `Basic ${serverClientSecret}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })

        return res.data
    } catch (error: any) {
        return error
    }
}

export const claim = async (introspectionUrl: string, serverClientSecret: string, token: string) => {
    try
    {
        const res = await axios.post(introspectionUrl, querystring.stringify({ token }), {
            headers: {
                Authorization: `Basic ${serverClientSecret}`,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });

        return res.data;
    } catch (error) {
        throw new Error(error)
    }
}

export const base64_encode = (s) => {
    return btoa(unescape(encodeURIComponent(s)));
}

export const base64_decode = (s) => {
    try {
        return decodeURIComponent(escape(atob(s)));
    } catch {}
}

export const isValidConnectionUrl = (urlString) =>
{
    try {
        const url = new URL(urlString);

        if (!url.protocol.includes("http")) {
            return false
        }

        return true
    } catch {
        return false;
    }
}

export const isValidUrl = (urlString) => {
    const urlPattern = new RegExp('^(https?:\\/\\/)'+ // validate protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
        '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator

    let response = !!urlPattern.test(urlString);

    if (!response && urlString.includes("localhost")) {
        response = isValidConnectionUrl(urlString)
    }

    return response;
}

export const sleepFor = (seconds) => {
    return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
};

export const capitalizeFirstLetter = (value: string): string => {
    return value.charAt(0).toUpperCase() + value.slice(1);
}

export const isWebLocalhost = () => Boolean(window.location.hostname === "localhost" ||
        window.location.hostname === "[::1]" ||
    /^127(?:\.(?:25[0-5]|2[0-4]\d|[01]?\d{1,2})){3}$/.test(window.location.hostname));

export const isUndefined = (value: unknown): boolean => typeof value === "undefined";

export const isLocalhost = (value) => Boolean(value === "localhost");

export const getCookie = (cookies, key: string): string => {
    const nameEQ = `${key}=`;
    const ca = cookies?.split(";") || [];
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

export const getFormattedCookie = (cookies, key) => {
    let value = cookies[key]

    value = decodeURIComponent(value)

    if (isNotEmpty(value)) {
        try {
            return JSON.parse(value)
        } catch {
            return value
        }
    }

    return null
}

export const formatDate = (value: string): string => {
    const d = new Date(value);

    const day = d.getDate()
    const dayOnWeek = d.getDay()

    const month = d.getMonth()
    const year = d.getFullYear()

    const h = d.getHours() < 10 ? "0" + d.getHours() : d.getHours()
    const m = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes()
    const s = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds()
    const p = d.getHours() >= 12 ? "PM" : "AM"

    const dayString = ['', 'st', 'nd', 'rd'];
    const weekString = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthString = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return `${weekString[dayOnWeek]}, ${monthString[month]} ${day}${dayString[day] || 'th'}, ${year}, ${h}:${m}:${s} ${p}`
}

export const checkEmailFormat = (value: string): boolean => (/^[\w.-]+@[\dA-Za-z-]+\.[\d.A-Za-z-]+$/gu).test(value);

export const randomKey = () => `rKEY_${generateRandomString()}`

export const sendEmailFunc = async (secret, mailInfo: { to; subject; text; html }): Promise<any> => {
    try {
        const serviceOnline = await axios.get(process.env.SEND_EMAIL_URL)

        if (serviceOnline.status === 200 && secret) {
            const params = {
                from: {
                    email: process.env.SEND_EMAIL_FROM,
                    name: process.env.SEND_EMAIL_FROM_NAME
                },
                to: {
                    email: mailInfo.to.email,
                    name: mailInfo.to?.name
                },
                subject: mailInfo.subject,
                text: mailInfo.text,
                html: mailInfo.html
            }

            await axios.post(`${process.env.SEND_EMAIL_URL}/sendEmail`, params, {
                headers: {
                    'x-stats': CryptoJS.AES.encrypt(secret, process.env.INTERNAL_SECRET),
                    'x-server': CryptoJS.AES.encrypt(process.env.SEND_EMAIL_SERVER, process.env.INTERNAL_SECRET)
                }
            })

            return true
        }

        return false
    } catch (error) {
        return false
    }
}

export const encryptSecretAES = (text, CLIENT_SECRET_ENC_KEY) => {
    const IV_LENGTH = 16;
    const ENCRYPTION_KEY = Buffer.from(CLIENT_SECRET_ENC_KEY, 'hex');
    const iv = crypto.randomBytes(IV_LENGTH);

    const cipher = crypto.createCipheriv('aes-128-cbc', ENCRYPTION_KEY, iv);

    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};

export const decryptSecretAES = (text, CLIENT_SECRET_ENC_KEY) => {
    try {
        const textParts = text.split(':');
        const iv = Buffer.from(textParts.shift(), 'hex');
        const encryptedText = Buffer.from(textParts.join(':'), 'hex');
        const ENCRYPTION_KEY = Buffer.from(CLIENT_SECRET_ENC_KEY, 'hex');

        const decipher = crypto.createDecipheriv('aes-128-cbc', ENCRYPTION_KEY, iv);

        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);

        return decrypted.toString();
    } catch {
        return null;
    }

};

const upperLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lowerLetters = 'abcdefghijklmnopqrstuvwxyz';
const numbers = '0123456789';
const characters = `${upperLetters}${numbers}${lowerLetters}`;

export const generateRandomString = (length = 10) => {
    const lowerLettersLength = lowerLetters.length;
    let result = lowerLetters.charAt(Math.floor(Math.random() * lowerLettersLength));

    const charactersLength = characters.length;
    for (let i = 0; i < length - 1; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result.toLowerCase();
};

export const getFormattedUrl = (req) => {
    return req.protocol + '://' + req.get('host') + req.originalUrl
}

export const encryptText = (value, secret = process.env.INTERNAL_SECRET) => CryptoJS.AES.encrypt(value, secret).toString();

export const decryptText = (value, secret = process.env.INTERNAL_SECRET) =>
{
    if (isNotEmpty(value) && value.startsWith("U2F")) {
        const res = CryptoJS.AES.decrypt(value, secret);
        const response = res.toString(CryptoJS.enc.Utf8);
        return response
    }

    return value
};

export const isFalse = (value) => !isTrue(value)

export const isTrue = (value) => {
    if (value === "true" || Boolean(value && typeof value === "boolean")) {
        return true;
    }

    return false;
};

export const compareNeo4jVersion = (ver1, ver2) => {
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

export const base64ToString = (code) => Buffer.from(code, "base64").toString("utf8");

export const stringToBase64 = (code) => Buffer.from(code, "utf8").toString("base64");

export const genRanHex = (size) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

export const isEmpty = (value) => {
    if (
        !value ||
      value === '' ||
      value.length === 0 ||
      value === null ||
      isObjectEmpty(value) ||
      value === undefined ||
      value === 'undefined'
    ) {
        return true
    }

    if (Array.isArray(value)) {
        return value.length === 0;
    }

    if (typeof value === "object") {
        return Object.keys(value).length === 0;
    }

    return false
}

const isObjectEmpty = (obj) => {
    for (const prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            return false
        }
    }

    return JSON.stringify(obj) === JSON.stringify({})
}

export const isNotEmpty = (value) => !isEmpty(value);

const readConfigMap = async (dir) => {
    const files = [];

    const response: any = {
        default: {},
        dataproxy: {},
        idp: {},
        authz: {},
        dashboard: {}
    };

    try {
        fs.readdirSync(dir).forEach(filename => {
            const name = path.parse(filename).name;
            const ext = path.parse(filename).ext;
            const filepath = path.resolve(dir, filename);
            const stat = fs.statSync(filepath);
            const isFile = stat.isFile();

            if (process.env.NODE_ENV === "test") {
                if (isFile && (ext === '.json' || ext === '.js')) {
                    files.push({
                        filepath, name, ext, stat,
                    });
                }
            } else {
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

        files.forEach(async (file) => {
            const content: any = fs.readFileSync(file.filepath, { encoding: 'utf8' });

            try
            {
                response[file.name] = JSON.parse(content);
            } catch
            {
                response[file.name] = content;
            }
        });
    } catch { }

    return response
}

export const readConfigMapDir = async (dir = 'etc/config') => {
    const properties: any = await readConfigMap(dir)

    if (!isEmpty(properties)) {
        let cm_default = properties.default
        let cm_dataproxy = properties.dataproxy
        let cm_idp = properties.idp
        let cm_authz = properties.authz
        const cm_dashboard = properties.dashboard

        try {
            cm_default = JSON.parse(properties.default)
        } catch {}

        try {
            cm_dataproxy = JSON.parse(properties.dataproxy)
        } catch {}

        try {
            cm_idp = JSON.parse(properties.idp)
        } catch {}

        try {
            cm_authz = JSON.parse(properties.authz)
        } catch {}

        return {
            default: cm_default,
            dataproxy: cm_dataproxy,
            idp: cm_idp,
            authz: cm_authz,
            dashboard: cm_dashboard,
        }
    }

    return null
}

export const updateConfigMapDir = async (file, jsonData, asString = true, dir = 'etc/config') => {
    try {
        if (asString) {
            await fs.promises.writeFile(dir + '/' + file, JSON.stringify(jsonData, null, 4), 'utf8');
        } else
        {
            await fs.promises.writeFile(dir + '/' + file, jsonData, 'utf8');
        }
    } catch (err) {
        throw new Error(err);
    }
}