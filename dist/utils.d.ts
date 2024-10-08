import 'dotenv/config';
export declare const edgesDateTime: () => string;
export declare const isJson: (str: any) => boolean;
export declare enum DBtype {
    neo4j = "neo4j",
    memgraph = "memgraph",
    arangodb = "arangodb",
    orientdb = "orientdb",
    neptune = "neptune",
    dgraph = "dgraph"
}
export declare const printTimestamp: (startQuery: any, endQuery: any, query: any, parameters: any) => void;
export declare const client_credentials: (credentialsUrl: string, serverClientSecret: string) => Promise<any>;
export declare const claim: (introspectionUrl: string, serverClientSecret: string, token: string) => Promise<any>;
export declare const base64_encode: (s: any) => string;
export declare const base64_decode: (s: any) => string;
export declare const isValidConnectionUrl: (urlString: any) => boolean;
export declare const isValidUrl: (urlString: any) => boolean;
export declare const sleepFor: (seconds: any) => Promise<unknown>;
export declare const capitalizeFirstLetter: (value: string) => string;
export declare const isWebLocalhost: () => boolean;
export declare const isUndefined: (value: unknown) => boolean;
export declare const isLocalhost: (value: any) => boolean;
export declare const getCookie: (cookies: any, key: string) => string;
export declare const getFormattedCookie: (cookies: any, key: any) => any;
export declare const formatDate: (value: string) => string;
export declare const checkEmailFormat: (value: string) => boolean;
export declare const randomKey: () => string;
export declare const sendEmailFunc: (secret: any, mailInfo: {
    to;
    subject;
    text;
    html;
}) => Promise<any>;
export declare const encryptSecretAES: (text: any, CLIENT_SECRET_ENC_KEY: any) => string;
export declare const decryptSecretAES: (text: any, CLIENT_SECRET_ENC_KEY: any) => string;
export declare const generateRandomString: (length?: number) => string;
export declare const getFormattedUrl: (req: any) => string;
export declare const encryptText: (value: any, secret?: string) => any;
export declare const decryptText: (value: any, secret?: string) => any;
export declare const isFalse: (value: any) => boolean;
export declare const isTrue: (value: any) => boolean;
export declare const compareNeo4jVersion: (ver1: any, ver2: any) => boolean;
export declare const base64ToString: (code: any) => string;
export declare const stringToBase64: (code: any) => string;
export declare const genRanHex: (size: any) => string;
export declare const isEmpty: (value: any) => boolean;
export declare const isNotEmpty: (value: any) => boolean;
export declare const readConfigMapDir: (dir?: string) => Promise<{
    default: any;
    dataproxy: any;
    idp: any;
    authz: any;
    dashboard: any;
}>;
export declare const updateConfigMapDir: (file: any, jsonData: any, asString?: boolean, dir?: string) => Promise<void>;
