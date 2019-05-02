import { gql } from "apollo-server-core";

export interface QueryPagination {
    limit: number;
    skip?: number;
}

export type QueryPrimitiveSort = 1 | -1;

export type QuerySort<Model> = {
    [Key in keyof Model]?: Model[Key] extends string | number | boolean
        ? QueryPrimitiveSort
        : QuerySort<Model[Key]>;
};

export type QueryPrimitive<Primitive extends string | number | boolean> = {
    AND?: QueryPrimitive<Primitive>[];
    OR?: QueryPrimitive<Primitive>[];
    NOR?: QueryPrimitive<Primitive>[];
    EQ?: Primitive;
    NEQ?: Primitive;
    EX?: Primitive;
    NEX?: Primitive;
    IN?: Primitive[];
    NIN?: Primitive[];
};

export type QueryString = QueryPrimitive<string>;
export type QueryBoolean = QueryPrimitive<boolean>;
export type QueryNumber = QueryPrimitive<number> & {
    GT?: number;
    GTE?: number;
    LT?: number;
    LTE?: number;
};

export type QueryThisPrimitive<Primitive extends string | number | boolean> = Primitive extends number
    ? QueryNumber
    : (
        Primitive extends string
            ? QueryString
            : QueryBoolean
    );

export type QueryPrimitiveItem<Primitive extends string | number | boolean> = {
    AT: number;
} & QueryThisPrimitive<Primitive>;

export type QueryModelItem<Model> = {
    AT: number;
} & QueryModel<Model>;

export type QueryPrimitiveArray<Primitive extends string | number | boolean> = {
    SIZE?: QueryNumber;
    ITEMS?: QueryPrimitiveItem<Primitive>[];
} & QueryThisPrimitive<Primitive>;

export type QueryModelArray<Model> = {
    SIZE?: QueryNumber;
    ITEMS?: QueryModelItem<Model>[];
} & QueryModel<Model>;

export type QueryModelField<Field> = Field extends string | number | boolean
    ? QueryThisPrimitive<Field>
    : (
        Field extends Array<string | number | boolean>
            ? QueryPrimitiveArray<ReturnType<Field['pop']>>
            : (
                Field extends Array<any>
                    ? QueryModelArray<ReturnType<Field['pop']>>
                    : QueryModel<Field>
            )
    );

export type QueryModel<Model> = {
    [Key in keyof Model]?: QueryModelField<Model[Key]>;
};

export type QueryModels<Model> = {
    pagination?: QueryPagination;
    sort?: QuerySort<Model>;
} & QueryModel<Model>;

export const queryPaginationGQLinputDef = gql`
input QueryPaginationInput {
    limit: Int!
    skip: Int
}
`;
export const queryStringGQLinputDef = gql`
input QueryStringInput {
    AND: [QueryStringInput!]
    OR: [QueryStringInput!]
    NOR: [QueryStringInput!]
    EQ: String
    NEQ: String
    EX: String
    NEX: String
    IN: [String!]
    NIN: [String!]
}
`;
export const queryStringItemGQLinputDef = gql`
input QueryStringItemInput {
    AT: Int!
    AND: [QueryStringInput!]
    OR: [QueryStringInput!]
    NOR: [QueryStringInput!]
    EQ: String
    NEQ: String
    EX: String
    NEX: String
    IN: [String!]
    NIN: [String!]
}
`;
export const queryStringArrayGQLinputDef = gql`
input QueryStringArrayInput {
    SIZE: QueryIntInput
    ITEMS: [QueryStringItemInput!]
    AND: [QueryStringInput!]
    OR: [QueryStringInput!]
    NOR: [QueryStringInput!]
    EQ: String
    NEQ: String
    EX: String
    NEX: String
    IN: [String!]
    NIN: [String!]
}
`;
export const queryBooleanGQLinputDef = gql`
input QueryBooleanInput {
    AND: [QueryBooleanInput!]
    OR: [QueryBooleanInput!]
    NOR: [QueryBooleanInput!]
    EQ: Boolean
    NEQ: Boolean
    EX: Boolean
    NEX: Boolean
    IN: [Boolean!]
    NIN: [Boolean!]
}
`;
export const queryBooleanItemGQLinputDef = gql`
input QueryBooleanItemInput {
    AT: Int!
    AND: [QueryBooleanInput!]
    OR: [QueryBooleanInput!]
    NOR: [QueryBooleanInput!]
    EQ: Boolean
    NEQ: Boolean
    EX: Boolean
    NEX: Boolean
    IN: [Boolean!]
    NIN: [Boolean!]
}
`;
export const queryBooleanArrayGQLinputDef = gql`
input QueryBooleanArrayInput {
    SIZE: QueryIntInput
    ITEMS: [QueryBooleanItemInput!]
    AND: [QueryBooleanInput!]
    OR: [QueryBooleanInput!]
    NOR: [QueryBooleanInput!]
    EQ: Boolean
    NEQ: Boolean
    EX: Boolean
    NEX: Boolean
    IN: [Boolean!]
    NIN: [Boolean!]
}
`;
export const queryIntGQLinputDef = gql`
input QueryIntInput {
    AND: [QueryIntInput!]
    OR: [QueryIntInput!]
    NOR: [QueryIntInput!]
    EQ: Int
    NEQ: Int
    EX: Int
    NEX: Int
    IN: [Int!]
    NIN: [Int!]
    GT: Int
    GTE: Int
    LT: Int
    LTE: Int
}
`;
export const queryIntItemGQLinputDef = gql`
input QueryIntItemInput {
    AT: Int!
    AND: [QueryIntInput!]
    OR: [QueryIntInput!]
    NOR: [QueryIntInput!]
    EQ: Int
    NEQ: Int
    EX: Int
    NEX: Int
    IN: [Int!]
    NIN: [Int!]
    GT: Int
    GTE: Int
    LT: Int
    LTE: Int
}
`;
export const queryIntArrayGQLinputDef = gql`
input QueryIntArrayInput {
    SIZE: QueryIntInput
    ITEMS: [QueryIntItemInput!]
    AND: [QueryIntInput!]
    OR: [QueryIntInput!]
    NOR: [QueryIntInput!]
    EQ: Int
    NEQ: Int
    EX: Int
    NEX: Int
    IN: [Int!]
    NIN: [Int!]
    GT: Int
    GTE: Int
    LT: Int
    LTE: Int
}
`;

export function capitalize(str: string) {
    return str.trim().slice(0, 1).toUpperCase() + str.trim().slice(1).toLowerCase();
}

export type Dependency = {
    input?: any;
    item?: any;
    array?: any;
};
export type Dependencies = { [x: string]: Dependency };

export function makeModelFieldInputDef<Model>(property: string, field: Model, dependencies: Dependencies = {}) {
    if (typeof(field) === 'string') {
        return {
            [property]: 
        };
    } else if (typeof(field) === 'number') {
        
    } else if (typeof(field) === 'boolean') {
        
    } else {
        
    }
}

export function makeModelGQLinputDef<Model>(rawName: string, instance: Model, dependencies: Dependencies = {}) {
    const name = rawName.trim().toLowerCase();
    const cName = capitalize(name);
    const queryModelInputName = `Query${cName}Input`;
    const queryModelItemInputName = `Query${cName}ItemInput`;
    const queryModelArrayInputName = `Query${cName}ArrayInput`;
    return gql`

    `;
}

export function makeModelsGQLinputDef<Model>(name: string, instance: Model) {

    return gql`
    extend type Query {

    }
    extend type Mutation {

    }
    `;
}
