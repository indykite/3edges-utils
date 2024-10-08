"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ecPublicKeyToPEM = exports.rsaPublicKeyToPEM = exports.certToPEM = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const jwk_to_pem_1 = __importDefault(require("jwk-to-pem"));
function certToPEM(cert) {
    cert = cert.match(/.{1,64}/g).join('\n');
    cert = `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`;
    return cert;
}
exports.certToPEM = certToPEM;
function prepadSigned(hexStr) {
    const [msb] = hexStr;
    if (msb < '0' || msb > '7') {
        return `00${hexStr}`;
    }
    return hexStr;
}
function toHex(number) {
    const nstr = number.toString(16);
    if (nstr.length % 2) {
        return `0${nstr}`;
    }
    return nstr;
}
function encodeLengthHex(n) {
    if (n <= 127) {
        return toHex(n);
    }
    const nHex = toHex(n);
    const lengthOfLengthByte = 128 + (nHex.length / 2);
    return toHex(lengthOfLengthByte) + nHex;
}
/*
 * Source: http://stackoverflow.com/questions/18835132/xml-to-pem-in-node-js
 */
function rsaPublicKeyToPEM(modulusB64, exponentB64) {
    const modulus = Buffer.from(modulusB64, 'base64');
    const exponent = Buffer.from(exponentB64, 'base64');
    const modulusHex = prepadSigned(modulus.toString('hex'));
    const exponentHex = prepadSigned(exponent.toString('hex'));
    const modlen = modulusHex.length / 2;
    const explen = exponentHex.length / 2;
    const encodedModlen = encodeLengthHex(modlen);
    const encodedExplen = encodeLengthHex(explen);
    const encodedPubkey = `30${encodeLengthHex(modlen + explen + (encodedModlen.length / 2) + (encodedExplen.length / 2) + 2)}02${encodedModlen}${modulusHex}02${encodedExplen}${exponentHex}`;
    const der = Buffer.from(encodedPubkey, 'hex')
        .toString('base64');
    let pem = `-----BEGIN RSA PUBLIC KEY-----\n`;
    pem += `${der.match(/.{1,64}/g).join('\n')}`;
    pem += `\n-----END RSA PUBLIC KEY-----\n`;
    return pem;
}
exports.rsaPublicKeyToPEM = rsaPublicKeyToPEM;
function ecPublicKeyToPEM(key) {
    const pem = (0, jwk_to_pem_1.default)(key);
    return pem;
}
exports.ecPublicKeyToPEM = ecPublicKeyToPEM;
