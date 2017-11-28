import { Postgrest } from "./postgrest";
import { Query } from "./query";

export class Model<T> {
  public id: string;
  public properties: T;

  private tableName: string;
  private postgrest: Postgrest;

  constructor(p: Postgrest, tableName: string) {
    this.postgrest = p;
    this.tableName = tableName;
  }

  public async update(properties?: T) {
    const toUpdateProperties = properties ? properties : this.properties;
    const result = await this.postgrest.query({
      body: toUpdateProperties,
      headers: {
        Accept: "application/vnd.pgrst.object+json",
        prefer: "return=representation",
      },
      tableName: this.tableName,
      verb: "PATCH",
    });
    this.properties = result.body;
    return this;
  }

  public async create(properties?: T) {
    const toCreateProperties = properties ? properties : this.properties;
    const result = await this.postgrest.query({
      body: toCreateProperties,
      headers: {
        Accept: "application/vnd.pgrst.object+json",
        prefer: "return=representation",
      },
      tableName: this.tableName,
      verb: "POST",
    });
    this.properties = result.body;
    return this;
  }

  public async delete() {
    const query = new Query();
    query.addFilter(`id=eq.${this.id}`);
    const result = await this.postgrest.query({
      headers: {
        Accept: "application/vnd.pgrst.object+json",
        prefer: "return=representation",
      },
      query,
      tableName: this.tableName,
      verb: "DELETE",
    });
    this.properties = result.body;
  }

  public get TableName() {
    return this.tableName;
  }
}
