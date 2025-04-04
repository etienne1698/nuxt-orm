import type { Collection } from "../collection/collection";
import type { Storage } from "../database/storage";
import type { InferModelFieldName, Primary } from "../types";
import { Operator, type OperatorValueType, type Query } from "./query";

export class QueryBuilder<C extends Collection> {
  declare query: Query<C>;

  constructor(
    public storage: Storage,
    public collection: C,
    query?: Query<C>
  ) {
    this.storage = storage;
    this.collection = collection;
    this.query = query || {
      filters: {
        [Operator.EQ]: {},
        [Operator.IN]: {},
        [Operator.NE]: {},
      },
      with: new Set<string>(),
      primaries: [],
    };
  }

  with(...relations: (keyof C["relations"])[]) {
    relations.forEach((r) => {
      this.query.with.add(r as string);
    });
    return this;
  }

  byPrimary(primaries: Primary[]) {
    primaries.forEach((primary) => {
      this.query.primaries.push(primary);
    });
    return this;
  }

  where<T extends keyof OperatorValueType>(
    field: InferModelFieldName<C["model"]>,
    op: T,
    value: OperatorValueType[T]
  ) {
    this.query.filters[op][field] =
      value as OperatorValueType[keyof OperatorValueType];
    return this;
  }

  whereEq(field: InferModelFieldName<C["model"]>, value: any) {
    return this.where(field, Operator.EQ, value);
  }

  whereNe(field: InferModelFieldName<C["model"]>, value: any) {
    return this.where(field, Operator.NE, value);
  }

  whereIn(field: InferModelFieldName<C["model"]>, value: Array<any>) {
    return this.where(field, Operator.IN, value);
  }

  get() {
    return this.storage.get(this.collection, this.query);
  }

  getFirst() {
    return this.get()?.[0];
  }
}
