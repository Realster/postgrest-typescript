import { Postgrest } from "./postgrest";

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
    const result = await this.postgrest.query(
      this.tableName,
      "PATCH",
      {
        Accept: "application/vnd.pgrst.object+json",
        prefer: "return=representation",
      },
      toUpdateProperties,
    );
    this.properties = result.body;
    return this;
  }

  public get TableName() {
    return this.tableName;
  }
}
