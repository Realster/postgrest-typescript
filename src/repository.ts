import { Model } from "./model";
import { Postgrest } from "./postgrest";
import { Query } from "./query";

export class Repository<T extends Model<any>> {
  public static async createRepository<T extends Model<any>>(
    postgrest: Postgrest,
    tableName: string,
    BaseClass: new (p: Postgrest, t: string) => T,
  ) {
    const repo = new Repository<T>(postgrest);
    repo.tableName = tableName;
    repo.baseClass = BaseClass;
    return repo;
  }

  public postgrest: Postgrest;
  public tableName: string;
  public baseClass: new (p: Postgrest, t: string) => T;

  constructor(postgrest: Postgrest) {
    this.postgrest = postgrest;
  }

  public async getAll(query?: Query, headers?: any): Promise<T[]> {
    const response = await this.postgrest.query({
      body: null,
      headers,
      query,
      tableName: this.tableName,
      verb: "GET",
    });
    const models = new Array<T>();
    const length = response.body.length;
    for (let i = 0; i < length; i++) {
      const body = response.body[i];
      const model = new this.baseClass(this.postgrest, this.tableName);
      model.id = body.id;
      model.properties = body;
      models.push(model as T);
    }
    return models;
  }

}
