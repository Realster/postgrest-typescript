import * as request from "request";

import { Query } from "./query";

export class Postgrest {
  private connection: string;
  private connected = false;

  constructor(connection: string) {
    this.connection = connection;
  }

  public async connect() {
    if (this.connection) {
      try {
        await this.tryConnection();
      } catch (err) {
        throw err;
      }
      this.connected = true;
      return true;
    } else {
      throw new Error("No Connection");
    }
  }

  public async query(tableName: string, verb: string, headers?: any, body?: any, query?: Query) {
    if (!this.isConnected()) {
      throw new Error("Not Connected yet");
    }
    return new Promise<any>((resolve, reject) => {
      const queryString = query ? query.getQuery() : "";
      request(`${this.connection}/${tableName}?${queryString}`, {
        body,
        headers,
        json: true,
        method: verb,
      }, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  }

  private async tryConnection() {
    return new Promise((resolve, reject) => {
      request.get(this.connection, {
        json: true,
      }, (err, response, body) => {
        if (err) {
          reject(err);
        } else if (response.statusCode !== 200) {
          reject(body);
        } else {
          resolve(body);
        }
      });
    });
  }

  private isConnected() {
    if (this.connected) {
      return true;
    } else {
      return false;
    }
  }
}
