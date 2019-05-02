import { gql } from "apollo-server-core";

export type Schema = {
    [x: string]: new (...args: any[]) => any,
};

const schemas = {};

export function entitySchemaFactory<S extends Schema>(name: string, entitySchema: S, constructorName: string = '') {
    schemas[name] = entitySchema;
    const cap = (str: string) => `${str.slice(0, 1).toUpperCase()}${str.slice(1).toLowerCase()}`;
    const thisPropsRequired = Object.entries(entitySchema).reduce((props, [prop, cstr]) => props + `
            ${prop}: ${cstr.name}!`, '');
    const thisProps = Object.entries(entitySchema).reduce((props, [prop, cstr]) => props + `
            ${prop}: ${cstr.name}`, '');
    const forProp = <S extends Schema>(idx: number, base: string, prop: string, cstr: new (...args: any[]) => any) => Object.keys(schemas).includes(cstr.name)
                ? Object.entries(Object.entries(schemas).find(([thisName]) => thisName === cstr.name)[1])
                    .reduce((thisProps, [thisProp, thisSchema]) => thisProps + `
            ${base}${thisProp}: ${
                Object.keys(schemas).includes(thisSchema.name)
                    ? forProp(idx + 1, `${base}${thisProp}_`, thisProp, thisSchema)
                    : thisSchema.name
            }`, !idx ? `${prop}: ${cstr.name}` : cstr.name)
                : `value: ${cstr.name}` 
            
    const thisPropsMongoOps = Object.entries(entitySchema).reduce((props, [prop, cstr]) => props + `
        input ${name}${cap(prop)}Query {
            ${forProp(0, `${prop}_`, prop, cstr)}
            EQ: ${cstr.name}
            NEQ: ${cstr.name}
        }
    `, '');
    const thisPropsQueries = Object.entries(entitySchema).reduce((props, [prop]) => props + `
            ${prop}: ${name}${cap(prop)}Query`, '');
    const schemaStr = `
        type ${name} {
            id: ID!${thisPropsRequired}
        }
        input ${name}Input {
            id: ID${thisProps}
        }
        input ${name}Document {${thisPropsRequired}
        }
        input ${name}Changes {${thisProps}
        }
        input ${name}Update {
            id: ID!
            changes: ${name}Changes
        }
        ${thisPropsMongoOps}
        input ${name}Query {${thisPropsQueries}
            EQ: ${name}Input
            NEQ: ${name}Input
        }
        extend type Query {
            ${name}s(query: ${name}Query): [${name}!]
            ${name}(id: ID!): ${name}
        }
        extend type Mutation {
            Create${name}s(documents: [${name}Document!]): [${name}!]
            Update${name}s(updates: [${name}Update!]): [${name}!]
            Delete${name}s(ids: [ID!]): [${name}!]
            Create${name}(document: ${name}Document!): ${name}
            Update${name}(update: ${name}Update!): ${name}
            Delete${name}(id: ID!): ${name}
        }
    `;
    // console.log(schemaStr);
    return gql`${schemaStr}`;
}
