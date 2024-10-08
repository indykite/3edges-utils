/* eslint-disable @typescript-eslint/no-explicit-any */

import * as crypto from "@aws-crypto/sha256-js";
import { defaultProvider } from "@aws-sdk/credential-provider-node";
import { HttpRequest } from "@aws-sdk/protocol-http";
import { SignatureV4 } from "@aws-sdk/signature-v4";
import neo4j from "neo4j-driver";
import * as formatter from "../neo4j/formatter";
import { DbProperties, Neo4jCallback, ObjectType } from "../neo4j/types";
import * as unique from "../neo4j/unique";
import * as connector from "./connector";

const signedHeader = async ({ region, port, serviceName, protocol, host, hostPort }) => {
  const req = new HttpRequest({
    method: "GET",
    protocol: protocol,
    hostname: host,
    port: port,
    path: "/opencypher",
    headers: {
      host: hostPort
    }
  });

  const signer = new SignatureV4({
    credentials: defaultProvider(),
    region: region,
    service: serviceName,
    sha256: crypto.Sha256
  });

  return signer.sign(req, { unsignableHeaders: new Set(["x-amz-content-sha256"]) }).then((signedRequest) => {
    const authInfo = {
      "Authorization": signedRequest.headers["authorization"],
      "HttpMethod": signedRequest.method,
      "X-Amz-Date": signedRequest.headers["x-amz-date"],
      "Host": signedRequest.headers["host"],
      "X-Amz-Security-Token": signedRequest.headers["x-amz-security-token"]
    };

    return JSON.stringify(authInfo);
  });
}

const createDriver = async (info) => {
    const region = info.neptune?.region;
    const serviceName = info.neptune?.serviceName;
    const port = 8182;
    const protocol = "bolt";
    const host = info.host;
    const hostPort = host + ":" + port;
    const url = protocol + "://" + hostPort;

    const authToken = {
        scheme: "basic",
        realm: "realm",
        principal: "principal",
        credentials: await signedHeader({ region, port, serviceName, protocol, host, hostPort })
    };

    return neo4j.driver(url, authToken, {
      encrypted: "ENCRYPTION_ON",
      trust: "TRUST_SYSTEM_CA_SIGNED_CERTIFICATES",
      maxConnectionPoolSize: info.maxConnectionPoolSize
    });
}

export class DatabaseManagement {
  private static _instance: DatabaseManagement;

  constructor(config: DbProperties) {
      const driver: any = createDriver(config)
      return connector.NeptuneConnection.getConnectionInstance(driver, config)
  }

  public static getInstance(config: DbProperties): DatabaseManagement {
      if (DatabaseManagement._instance) {
          return DatabaseManagement._instance
      }

      DatabaseManagement._instance = new DatabaseManagement(config);
      return DatabaseManagement._instance
  }
}

const useFormatter = formatter
const uniqueConnector = unique

export default neo4j;
export { uniqueConnector, useFormatter };
export type { Neo4jCallback, ObjectType };

