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

export const queryPaginationGQLinputDef = `
input QueryPaginationInput {
    limit: Int!
    skip: Int
}
`;
export const queryStringGQLinputDef = `
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
export const queryStringItemGQLinputDef = `
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
export const queryStringArrayGQLinputDef = `
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
export const queryBooleanGQLinputDef = `
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
export const queryBooleanItemGQLinputDef = `
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
export const queryBooleanArrayGQLinputDef = `
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
export const queryIntGQLinputDef = `
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
export const queryIntItemGQLinputDef = `
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
export const queryIntArrayGQLinputDef = `
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

export type _Dependency = {
    sort?: any;
    input?: any;
    type?: any;
    changes?: any;
    update?: any;
    item?: any;
    array?: any;
    root?: any;
    typeName?: string;
    changesName?: string;
    updateName?: string;
    inputName?: string;
    itemName?: string;
    sortName?: string;
    arrayName?: string;
    inputTypeName?: string;
    inputType?: any;
    gql?: any;
    queries?: any;
    mutations?: any;
    args?: any;
    argsRequired?: any;
};

export type Dependency = _Dependency | string
export type Dependencies = { [x: string]: Dependency };

export function makeModelFieldInputDef<Model>(property: string, field: Model, dependencies: Dependencies = {}) {
    // field is a primitive string
    if (typeof(field) === 'string') {
        return `
    ${property}: QueryStringInput`;
    // field is a primitive number
    } else if (typeof(field) === 'number') {
        return `
    ${property}: QueryIntInput`;
    // field is a primitive boolean
    } else if (typeof(field) === 'boolean') {
        return `
    ${property}: QueryBooleanInput`;
    } else if (Array.isArray(field)) {
        // field is an array of primitive string
        if (typeof(field[0]) === 'string') {
            return `
    ${property}: QueryStringArrayInput`;
        // field is an array of primitive number
        } else if (typeof(field[0]) === 'number') {
            return `
    ${property}: QueryIntArrayInput`;
        // field is an array of primitive boolean
        } else if (typeof(field[0]) === 'boolean') {
            return `
    ${property}: QueryBooleanArrayInput`;
        // field is an array of models
        } else {
            const initialDependency = dependencies[property] as string;
            return `
    ${property}: ${(dependencies[initialDependency] as _Dependency).arrayName}`;
        }
    // field is a model
    } else {
            const initialDependency = dependencies[property] as string;
            return `
    ${property}: ${(dependencies[initialDependency] as _Dependency).inputName}`;
    }
}

export function makeModelFieldTypeDef<Model>(property: string, field: Model, dependencies: Dependencies = {}) {
    // field is a primitive string
    if (typeof(field) === 'string') {
        return `
    ${property}: String!`;
    // field is a primitive number
    } else if (typeof(field) === 'number') {
        return `
    ${property}: Int!`;
    // field is a primitive boolean
    } else if (typeof(field) === 'boolean') {
        return `
    ${property}: Boolean!`;
    } else if (Array.isArray(field)) {
        // field is an array of primitive string
        if (typeof(field[0]) === 'string') {
            return `
    ${property}: [String!]!`;
        // field is an array of primitive number
        } else if (typeof(field[0]) === 'number') {
            return `
    ${property}: [Int!]!`;
        // field is an array of primitive boolean
        } else if (typeof(field[0]) === 'boolean') {
            return `
    ${property}: [Boolean!]!`;
        // field is an array of models
        } else {
            const initialDependency = dependencies[property] as string;
            return `
    ${property}: [${(dependencies[initialDependency] as _Dependency).typeName}!]!`;
        }
    // field is a model
    } else {
            const initialDependency = dependencies[property] as string;
            return `
    ${property}: ${(dependencies[initialDependency] as _Dependency).typeName}!`;
    }
}

export function makeModelFieldChangesDef<Model>(property: string, field: Model, dependencies: Dependencies = {}) {
    // field is a primitive string
    if (typeof(field) === 'string') {
        return `
    ${property}: String`;
    // field is a primitive number
    } else if (typeof(field) === 'number') {
        return `
    ${property}: Int`;
    // field is a primitive boolean
    } else if (typeof(field) === 'boolean') {
        return `
    ${property}: Boolean`;
    } else if (Array.isArray(field)) {
        // field is an array of primitive string
        if (typeof(field[0]) === 'string') {
            return `
    ${property}: [String!]`;
        // field is an array of primitive number
        } else if (typeof(field[0]) === 'number') {
            return `
    ${property}: [Int!]`;
        // field is an array of primitive boolean
        } else if (typeof(field[0]) === 'boolean') {
            return `
    ${property}: [Boolean!]`;
        // field is an array of models
        } else {
            const initialDependency = dependencies[property] as string;
            return `
    ${property}: [${(dependencies[initialDependency] as _Dependency).changesName}!]`;
        }
    // field is a model
    } else {
            const initialDependency = dependencies[property] as string;
            return `
    ${property}: ${(dependencies[initialDependency] as _Dependency).changesName}`;
    }
}

export function getArgType(prop: string, arg, dependencies: Dependencies = {}) {
    // field is a primitive string
    if (typeof(arg) === 'string') {
        return `${prop}: String`;
    // field is a primitive number
    } else if (typeof(arg) === 'number') {
        return `${prop}: Int`;
    // field is a primitive boolean
    } else if (typeof(arg) === 'boolean') {
        return `${prop}: Boolean`;
    } else if (Array.isArray(arg)) {
        // field is an array of primitive string
        if (typeof(arg[0]) === 'string') {
            return `${prop}: [String!]`;
        // field is an array of primitive number
        } else if (typeof(arg[0]) === 'number') {
            return `${prop}: [Int!]`;
        // field is an array of primitive boolean
        } else if (typeof(arg[0]) === 'boolean') {
            return `${prop}: [Boolean!]`;
        // field is an array of models
        } else {
            const initialDependency = dependencies[prop] as string;
            return `${prop}: ${(dependencies[initialDependency] as _Dependency).inputTypeName}`;
        }
    // field is a model
    } else {
            const initialDependency = dependencies[prop] as string;
            return `${prop}: ${(dependencies[initialDependency] as _Dependency).inputTypeName}`;
    }
}

export function getSortFieldInput(prop: string, arg, dependencies: Dependencies = {}) {

    if (typeof(arg) === 'string' || typeof(arg) === 'number' || typeof(arg) === 'boolean') {
        return `
    ${prop}: Int`;
    } else if (Array.isArray(arg)) {
        if (typeof(arg[0]) === 'string' || typeof(arg[0]) === 'number' || typeof(arg[0]) === 'boolean') {
            return `
    ${prop}: Int`;
        } else {
            const initialDependency = dependencies[prop] as string;
            return `
    ${prop}: ${(dependencies[initialDependency] as _Dependency).sortName}`;
        }
    } else {
            const initialDependency = dependencies[prop] as string;
            return `
    ${prop}: ${(dependencies[initialDependency] as _Dependency).sortName}`;
    }
}

export function makeModelGQLinputDef<Model>(rawName: string, instance: Model, dependencies: Dependencies = {}) {
    const name = rawName.trim().toLowerCase();
    const cName = capitalize(name);
    const queryModelInputName = `Query${cName}Input`;
    const queryModelItemInputName = `Query${cName}ItemInput`;
    const queryModelArrayInputName = `Query${cName}ArrayInput`;
    const queryTypeName = `${cName}`;
    const queryChangesName = `${cName}ChangesInput`;
    const queryUpdateName = `${cName}UpdateInput`;
    const sortName = `${cName}SortInput`;
    dependencies[rawName] = {
        inputName: queryModelInputName,
        itemName: queryModelItemInputName,
        arrayName: queryModelArrayInputName,
        typeName: queryTypeName,
        changesName: queryChangesName,
        updateName: queryUpdateName,
    };
    const propertiesSort = Object.keys(instance)
        .reduce((thisDef, property, idx) => thisDef + getSortFieldInput(property, instance[property], dependencies).slice(idx ? 0 : 5), '');
    const propertiesDefs = Object.keys(instance)
        .reduce((thisDef, property, idx) => thisDef + makeModelFieldInputDef(property, instance[property], dependencies).slice(idx ? 0 : 5), '');
    const propertiesTypeDefs = Object.keys(instance)
        .reduce((thisDef, property, idx) => thisDef + makeModelFieldTypeDef(property, instance[property], dependencies).slice(idx ? 0 : 5), '');
    const propertiesChangesDefs = Object.keys(instance)
        .reduce((thisDef, property, idx) => thisDef + makeModelFieldChangesDef(property, instance[property], dependencies).slice(idx ? 0 : 5), '');
    const defs = `
input ${queryModelInputName} {
    ${propertiesDefs}
}
`;
    const rootDefs = `
input ${queryModelInputName}Root {
    ${propertiesDefs}
    pagination: QueryPagination
}
`;
    const input = `
input ${queryTypeName}Input {
    ${propertiesTypeDefs}
}
`;
    const itemDefs = `
input ${queryModelItemInputName} {
    AT: Int!
    ${propertiesDefs}
}
    `;
    const arrayDefs = `
input ${queryModelArrayInputName} {
    SIZE: QueryIntInput
    ITEMS: [${queryModelItemInputName}!]
    ${propertiesDefs}
}
    `;
    const typeDef = `
type ${queryTypeName} {
    ${propertiesTypeDefs}
}
    `;
    const changesDef = `
input ${queryChangesName} {
    ${propertiesChangesDefs}
}
    `;
    const updateDef = `
input ${queryUpdateName} {
    id: ID!
    changes: ${queryChangesName}!
}
    `;
    const sort = `
input ${cName}SortInput {
    ${propertiesSort}
}
    `;
    const argsRequired = Object.keys(instance).reduce((thisArgs, key) => thisArgs + (thisArgs ? `, ${getArgType(key, instance[key], dependencies)}!` : `${getArgType(key, instance[key], dependencies)}!`), '');
    const args = Object.keys(instance).reduce((thisArgs, key) => thisArgs + (thisArgs ? `, ${getArgType(key, instance[key], dependencies)}` : `${getArgType(key, instance[key], dependencies)}`), '');
    dependencies[rawName] = {
        root: rootDefs,
        inputName: queryModelInputName,
        itemName: queryModelItemInputName,
        arrayName: queryModelArrayInputName,
        input: defs,
        inputTypeName: queryTypeName + 'Input',
        inputType: input,
        item: itemDefs,
        array: arrayDefs,
        sort: sort,
        sortName: sortName,
        typeName: queryTypeName,
        changesName: queryChangesName,
        updateName: queryUpdateName,
        type: typeDef,
        changes: changesDef,
        update: updateDef,
        args: args,
        argsRequired: argsRequired,
        gql: defs,
        queries: `
    get${cName}Where(query: ${queryModelInputName + 'Root'}): [${cName}!]
    getById${cName}(id: ID!): ${cName}`,
        mutations: `
    create${cName}(input: ${queryTypeName + 'Input!'}): ${cName}
    update${cName}(update: ${queryUpdateName}!): ${cName}
    delete${cName}(id: ID!): ${cName}
    create${cName}Many(inputs: [${queryTypeName + 'Input'}!]!): [${cName}!]
    update${cName}Many(updates: [${queryUpdateName}!]!): [${cName}!]
    delete${cName}Many(ids: [ID!]!): [${cName}]
    update${cName}Where(query: ${queryModelInputName}!, changes: ${queryChangesName}!): [${cName}!]
    delete${cName}Where(query: ${queryModelInputName}!): [${cName}]`,
    };
    return dependencies;
}

export function makeModelsGQLinputDef(dependencies: Dependencies) {
    return `
    ${queryStringGQLinputDef}
    ${queryStringItemGQLinputDef}
    ${queryStringArrayGQLinputDef}
    ${queryBooleanGQLinputDef}
    ${queryBooleanItemGQLinputDef}
    ${queryBooleanArrayGQLinputDef}
    ${queryIntGQLinputDef}
    ${queryIntItemGQLinputDef}
    ${queryIntArrayGQLinputDef}
${Object.keys(dependencies)
    .filter(key => typeof(dependencies[key]) !== 'string')
    .reduce((gqlDef, key) => gqlDef
        + `${(dependencies[key] as _Dependency).root}`
        + `${(dependencies[key] as _Dependency).input}`
        + `${(dependencies[key] as _Dependency).sort}`
        + `${(dependencies[key] as _Dependency).item}`
        + `${(dependencies[key] as _Dependency).array}`
        + `${(dependencies[key] as _Dependency).changes}`
        + `${(dependencies[key] as _Dependency).update}`
        + `${(dependencies[key] as _Dependency).inputType}`
        + `${(dependencies[key] as _Dependency).type}`, '')
}
type Query {
    ${Object.keys(dependencies)
        .filter(key => typeof(dependencies[key]) !== 'string')
        .reduce((gqlDef, key) => gqlDef + `${(dependencies[key] as _Dependency).queries}`, '').slice(5)
    }
}
type Mutation {
    ${Object.keys(dependencies)
        .filter(key => typeof(dependencies[key]) !== 'string')
        .reduce((gqlDef, key) => gqlDef + `${(dependencies[key] as _Dependency).mutations}`, '').slice(5)
    }
}
`;
}

