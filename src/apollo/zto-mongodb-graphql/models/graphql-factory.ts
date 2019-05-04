export interface GraphqlSchema {
    [x: string]: any;
    selector: string;
    document: any;
}

export interface GraphqlResolver {
    [x: string]: any;
    selector: string;
}

export interface GraphqlDefinition {
    [x: string]: any;
    
    selector: string;
    document: any;

    modelName?: string;
    modelTypeName?: string;
    modelInputName?: string;
    newModelInputName?: string;
    modelChangesInputName?: string;
    modelUpdateInputName?: string;
    modelQueryInputName?: string;

    modelTypeGQLdef?: string;
    modelInputGQLdef?: string;
    newModelInputGQLdef?: string;
    modelChangesInputGQLdef?: string;
    modelUpdateInputGQLdef?: string;
    modelQueryInputGQLdef?: string;

    fields?: GraphqlDefinition[];
}

export interface GraphqlEntry {
    selector: string;
    definition?: string;
}

export interface GraphqlModel {
    selector: string,
    type?: GraphqlEntry;
    input?: GraphqlEntry;
    createInput?: GraphqlEntry;
    updateInput?: GraphqlEntry;
    queryInput?: GraphqlEntry;
    queryItemInput?: GraphqlEntry;
    queryArrayInput?: GraphqlEntry;
}

export class HasOne {
    has = 'one';
    what: any;
    constructor(
        public who: any,
        what: any,
        public as: string,
        public required: boolean = false
    ) {
        this.what = what.type ? what : { type: what };
    }
}
export class HasMany {
    has = 'many';
    what: any;
    constructor(
        public who: any,
        what: any,
        public as: string,
        public required: boolean = false
    ) {
        this.what = what.type ? what.type : what;
        
    }
}

export class GraphqlFactory {

    private dependencies: { [selector: string]: GraphqlModel } = {};

    /*private */schemas: { [selector: string]: GraphqlSchema } = {};
    /*private */definitions: { [selector: string]: GraphqlDefinition } = {};
    /*private */resolvers: { [selector: string]: GraphqlResolver } = {};

    constructor() {
        this.dependencies = {
        };
    }

    private absorbSelectors({ selector }: GraphqlSchema) {
        const base = `${
            selector.trim().slice(0, 1).toLocaleUpperCase()
        }${
            selector.trim().slice(1).toLocaleLowerCase()
        }`;
        this.dependencies[selector] = {
            selector: selector,
            type: {
                selector: base
            },
            input: {
                selector: `${base}Input`
            },
            createInput: {
                selector: `Create${base}Input`
            },
            updateInput: {
                selector: `Update${base}Input`
            },
            queryInput: {
                selector: `Query${base}Input`
            },
            queryItemInput: {
                selector: `Query${base}ItemInput`
            },
            queryArrayInput: {
                selector: `Query${base}ArrayInput`
            },
        };
        // console.log(`this.dependencies[${selector}]: `, this.dependencies[selector]);
    }

    private computeDocumentField(prop: string, field: any) {
        field = field.type ? field : { type: field };
        if (Array.isArray(field.type) || [String, Number, Boolean].includes(field.type)) {
            const primitive = Array.isArray(field.type) ? field.type[0] : field.type;
            const isArray = Array.isArray(field.type);
            switch (primitive) {
                case String:
                    return { isPrimitive: true, primitive: 'String', isArray };
                case Number:
                    return { isPrimitive: true, primitive: 'Number', isArray };
                case Boolean:
                    return { isPrimitive: true, primitive: 'Boolean', isArray };
                default:
                    throw new Error(`Cannot undersand field for prop (${prop})` + field);
            }
        } else if (typeof(field.type) === 'function') {
            const hasInstance = field.type();
            if (!(hasInstance && hasInstance.has)) {
                throw new Error(`Cannot undersand field for prop (${prop})` + field);
            }
            return { isPrimitive: false, isArray: hasInstance.isArray, hasInstance };
        } else {
            throw new Error(`Cannot undersand field for prop (${prop})` + field);
        }
    }

    private computeTypeDocumentField(prop: string, field: any, withRequire: boolean = true) {
        const {
            isPrimitive,
            isArray,
            primitive,
            hasInstance,
        } = this.computeDocumentField(prop, field);
        if (isArray) {
            if (isPrimitive) {
                return `    ${prop}: [${primitive}!]${withRequire && field.required ? '!' : ''}`
            } else {
                return `    ${prop}: [${hasInstance.what}!]${withRequire && field.required ? '!' : ''}`;
            }
        } else {
            if (isPrimitive) {
                return `    ${prop}: ${primitive}${withRequire && field.required ? '!' : ''}`
            } else {
                return `    ${prop}: ${hasInstance.what}${withRequire && field.required ? '!' : ''}`;
            }
        }
    }

    private computeInputDocumentField(prop: string, field: any) {
    }

    private computeCreateInputDocumentField(prop: string, field: any) {
    }

    private computeUpdateInputDocumentField(prop: string, field: any) {
    }

    private computeQueryInputDocumentField(prop: string, field: any, withRequire: boolean = true) {
        const {
            isPrimitive,
            isArray,
            primitive,
            hasInstance,
        } = this.computeDocumentField(prop, field);
        if (isArray) {
            if (isPrimitive) {
                return `    ${prop}: Query${primitive}ArrayInput${withRequire && field.required ? '!' : ''}\n`
            } else {
                return `    ${prop}: Query${hasInstance.what.type}ArrayInput${withRequire && field.required ? '!' : ''}\n`;
            }
        } else {
            if (isPrimitive) {
                return `    ${prop}: Query${primitive}Input${withRequire && field.required ? '!' : ''}\n`
            } else {
                return `    ${prop}: Query${hasInstance.what.type}Input${withRequire && field.required ? '!' : ''}\n`;
            }
        }
    }

    private computeQueryItemInputDocumentField(prop: string, field: any) {
    }

    private computeQueryArrayInputDocumentField(prop: string, field: any) {
    }

    private absorbDocuments({ selector, document }: GraphqlSchema) {
        const {
            type,
            input,
            createInput,
            updateInput,
            queryInput,
            queryItemInput,
            queryArrayInput
        } = this.dependencies[selector];
        type.definition = `
type ${type.selector} {
${
    Object.entries(document)
        .reduce((fields, [prop, value]) => `${fields}${this.computeTypeDocumentField(prop, value)}`, '')
}
}`;
        input.definition = `
input ${input.selector} {
${
    Object.entries(document)
        .reduce((fields, [prop, value]) => `${fields}${this.computeTypeDocumentField(prop, value)}`, '')
}
}`;
        createInput.definition = `
input ${createInput.selector} {
${
    Object.entries(document)
        .reduce((fields, [prop, value]) => `${fields}${this.computeTypeDocumentField(prop, value)}`, '')
}
}`;
        updateInput.definition = `
input ${updateInput.selector} {
${
    Object.entries(document)
        .reduce((fields, [prop, value]) => `${fields}${this.computeTypeDocumentField(prop, value, false)}`, '')
}
}`;
        queryInput.definition = `
input ${queryInput.selector} {
${
    Object.entries(document)
        .reduce((fields, [prop, value]) => `${fields}${this.computeQueryInputDocumentField(prop, value)}`, '')
}
}`;
        queryItemInput.definition = `
input ${queryItemInput.selector} {
    AS: Int!
${
    Object.entries(document)
        .reduce((fields, [prop, value]) => `${fields}${this.computeQueryInputDocumentField(prop, value)}`, '')
}
}`;
        queryArrayInput.definition = `
input ${queryArrayInput.selector} {
    SIZE: QueryNumberInput
    ITEMS: [${queryItemInput.selector}!]
${
    Object.entries(document)
        .reduce((fields, [prop, value]) => `${fields}${this.computeQueryInputDocumentField(prop, value)}`, '')
}
}`;
        console.log(
            type.selector, type.definition,
            input.selector, input.definition,
            createInput.selector, createInput.definition,
            updateInput.selector, updateInput.definition,
            queryInput.selector, queryInput.definition,
            queryItemInput.selector, queryItemInput.definition,
            queryArrayInput.selector, queryArrayInput.definition
        );
    }

    absorb(...schemas: GraphqlSchema[]) {
        schemas.forEach(schema => this.absorbSelectors(schema));
        schemas.forEach(schema => this.absorbDocuments(schema));
    }

    create(selector: string) {
    }
}



/**
 *
        schemasArray.forEach(schema => {
            console.log('First pass on ', schema);
            const selector = schema.selector;
            this.schemas[selector] = schema;
            const modelName = `${
                schema.selector.trim().slice(0, 1).toLocaleUpperCase()
            }${
                schema.selector.trim().slice(1).toLocaleLowerCase()
            }`;
            const modelTypeName = modelName;
            const modelInputName = `${modelName}Input`;
            const newModelInputName = `New${modelName}Input`;
            const modelChangesInputName = `${modelName}ChangesInput`;
            const modelUpdateInputName = `${modelName}UpdateInput`;
            const modelQueryInputName = `${modelName}QueryInput`;
            this.definitions[selector] = {
                selector,
                modelName,
                modelTypeName,
                modelInputName,
                newModelInputName,
                modelChangesInputName,
                modelUpdateInputName,
                modelQueryInputName,
            };
        });

        type PrimitiveContructor = StringConstructor | NumberConstructor | BooleanConstructor;
        type PojoConstructor<This = any> = { [Key in keyof This]: This[Key] };
        type ClassConstructor<This = any> = new (...args: any[]) => This;
        type Constructor<This = any> = PojoConstructor<This> | ClassConstructor<This> | PrimitiveContructor;
        const isPrimitive = (constructor: Constructor) => {
            return [String, Number, Boolean].includes(constructor as PrimitiveContructor);
        };
        const typeofPrimitive = (primitive: PrimitiveContructor) => {
            switch (primitive) {
                case String:
                    return 'String';
                case Number:
                    return 'Number';
                case Boolean:
                    return 'Boolean';
                default:
                    return 'Unknow';
            }
        };
        const formatStr = (format: string, ...args: string[]) => {
            return args.reduce((thisFormat, arg, idx) => thisFormat.replace(`$${idx}`, arg), format);
        };

        schemasArray.forEach(schema => {
            console.log('Second pass on ', schema);
            const {
                selector,
                modelName,
                modelTypeName,
                modelInputName,
                newModelInputName,
                modelChangesInputName,
                modelUpdateInputName,
                modelQueryInputName,
            } = this.definitions[schema.selector];
            const dependencies = Object.entries(schema.document)
                .map(([prop, def]) => [prop, (def as any).type ? (def as any).type : def, def])
                .filter(([, typeDef]) => !isPrimitive(typeDef))
                .reduce((deps, [prop, typeDef, def]) => {
                    console.log('Resolving dependency for ', prop, typeDef);
                    const dependencySchema = Object.values(this.schemas).find(thisSchema => {
                        console.log('Comparing: (', thisSchema.document === typeDef, '): ', thisSchema.document, ' WITH ' , typeDef);
                        return thisSchema.document === typeDef;
                    });
                    const dependencyDefinition = this.definitions[dependencySchema.selector];
                    deps[prop] = {
                        selector: dependencySchema && dependencySchema.selector,
                        schema: dependencySchema,
                        definition: dependencyDefinition,
                        prop, typeDef, def
                    };
                    return deps;
                }, {});
            const modelFieldsTypeDef = Object.entries(schema.document)
                .map(([prop, def]) => [prop, (def as any).type ? (def as any).type : def, def])
                .reduce((fieldsTypeDef, [prop, typeDef, def]) => {
                    const typeName = !isPrimitive(typeDef) && dependencies[prop]
                        ? dependencies[prop].definition.modelTypeName
                        : typeofPrimitive(typeDef);
                    const payload = `${prop}: ${typeName}${def.required === true ? '!' : ''}`;
                    return `    ${payload}\n`;
                }, '');
            const modelTypeDef = formatStr(modelTypeDefFormat, modelName, modelFieldsTypeDef);
            this.definitions[schema.selector].modelTypeDef = modelTypeDef;
        });
 */