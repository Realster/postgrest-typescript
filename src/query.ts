export interface IRelation {
  relationName: string;
  columns: string[];
  rename?: string;
  childs?: IRelation[];
}
export class Query {
  private selects: string[];
  private order: string;
  private limit: string;
  private offset: string;
  private filters: string[];
  private relations: IRelation[];

  constructor() {
    this.selects = new Array<string>();
    this.filters = new Array<string>();
    this.relations = new Array<IRelation>();
  }

  public addSelect(columnName: string) {
    this.selects.push(columnName);
  }

  public addRelation(relation: IRelation) {
    this.relations.push(relation);
  }

  public setOrder(order: string) {
    this.order = order;
  }

  public setLimit(limit: string) {
    this.limit = limit;
  }

  public setOffset(offset: string) {
    this.offset = offset;
  }

  public addFilter(filter: string) {
    this.filters.push(filter);
  }

  public getQuery() {
    const parts = new Array<string>();

    const relationSelect = this.getRelationSelect();
    if (relationSelect) {
      parts.push(`select=${relationSelect}`);
    }

    const filters = this.filters.join(",");
    if (filters) {
      parts.push(filters);
    }

    if (this.order) {
      parts.push(`order=${this.order}`);
    }

    if (this.limit) {
      parts.push(`limit=${this.limit}`);
    }

    if (this.offset) {
      parts.push(`offset=${this.offset}`);
    }

    return parts.join("&");
  }

  private getRelationSelect() {
    const relations = this.getRelationString();
    const selects = this.selects.join(",");
    const relationSelectArray = new Array<string>();
    if (selects) {
      relationSelectArray.push(selects);
    }
    if (relations) {
      relationSelectArray.push(relations);
    }
    return relationSelectArray.join(",");
  }

  private getRelationString() {
    const result = new Array<string>();
    for (const relation of this.relations) {
      result.push(this.generateRelation(relation));
    }
    return result.join(",");
  }

  private generateRelation(relation: IRelation) {
    let relationString = "";
    const childRelations = new Array<string>();

    if (relation.childs) {
      for (const childRelation of relation.childs) {
        childRelations.push(this.generateRelation(childRelation));
      }
    }

    const columns = relation.columns.join(",");
    const childs = childRelations.join(",");
    const rename = relation.rename ? `${relation.rename}:` : "";

    const columnChildArray = new Array<string>();
    if (columns) {
      columnChildArray.push(columns);
    }
    if (childs) {
      columnChildArray.push(childs);
    }

    const columnChild = columnChildArray.join(",");

    relationString = `${rename}${relation.relationName}(${columnChild})`;

    return relationString;
  }
}
