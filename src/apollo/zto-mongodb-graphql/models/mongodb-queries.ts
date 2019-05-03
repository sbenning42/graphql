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
    inputName?: string;
    itemName?: string;
    arrayName?: string;
};
export type Dependencies = { [x: string]: Dependency };

export function makeModelFieldInputDef<Model>(property: string, field: Model, dependencies: Dependencies = {}) {
    // field is a primitive string
    if (typeof(field) === 'string') {
        return `${property}: QueryStringInput
        `;
    // field is a primitive number
    } else if (typeof(field) === 'number') {
        return `${property}: QueryIntInput
        `;
    // field is a primitive boolean
    } else if (typeof(field) === 'boolean') {
        return `${property}: QueryBooleanInput
        `;
    } else if (Array.isArray(field)) {
        // field is an array of primitive string
        if (typeof(field[0]) === 'string') {
            return `${property}: QueryStringArrayInput
            `;
        // field is an array of primitive number
        } else if (typeof(field[0]) === 'number') {
            return `${property}: QueryIntArrayInput
            `;
        // field is an array of primitive boolean
        } else if (typeof(field[0]) === 'boolean') {
            return `${property}: QueryBooleanArrayInput
            `;
        // field is an array of models
        } else {
            return `${property}: ${dependencies[property].arrayName}
            `;
        }
    // field is a model
    } else {
        return `${property}: ${dependencies[property].inputName}
        `;
    }
}

export function makeModelGQLinputDef<Model>(rawName: string, instance: Model, dependencies: Dependencies = {}) {
    const name = rawName.trim().toLowerCase();
    const cName = capitalize(name);
    const queryModelInputName = `Query${cName}Input`;
    const queryModelItemInputName = `Query${cName}ItemInput`;
    const queryModelArrayInputName = `Query${cName}ArrayInput`;
    dependencies[rawName] = {
        inputName: queryModelInputName,
        itemName: queryModelItemInputName,
        arrayName: queryModelArrayInputName,
    };
    const properiesDefs = Object.keys(instance)
        .reduce((thisDef, property) => thisDef + makeModelFieldInputDef(property, instance[property], dependencies), '');
    const defs = `
    input ${queryModelInputName} {
        ${properiesDefs}
    }
    `;
    dependencies[rawName] = {
        inputName: queryModelInputName,
        itemName: queryModelItemInputName,
        arrayName: queryModelArrayInputName,
        input: defs
    };
    console.log(defs);
    return gql`${defs}`;
}

export function makeModelsGQLinputDef<Model>(name: string, instance: Model) {

    return gql`
    extend type Query {

    }
    extend type Mutation {

    }
    `;
}
