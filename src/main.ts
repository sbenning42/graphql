import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import { environment } from "./environments";
import { Server } from "./apollo/server";
import { makeModelGQLinputDef, Dependencies, makeModelsGQLinputDef } from "./apollo/zto-mongodb-graphql/models/mongodb-queries";
import { gql } from "apollo-server-core";

// console.log('With envionment: ', environment);

const db = mongoose.connect(
  `mongodb://${environment.MONGODB_HOST}:${environment.MONGODB_PORT}/${environment.MONGODB_NAME}`,
  { useCreateIndex: true, useNewUrlParser: true }
);

const app = express();

app.use(
  bodyParser.json(),
  cors(),
);

const server = new Server(app, db);

server.listen({ port: environment.PORT }, () => {
  console.log(`Apollo Server on http://localhost:${environment.PORT}/graphql`);
});

interface Doc0 {
  str: string;
  bools: boolean[];
}
interface Doc1 {
  str: string;
  thisDoc0: Doc0;
}
interface Doc2 {
  str: string;
  doc1s: Doc1[];
}

const doc0: Doc0 = {
  str: 'test 0',
  bools: [true, false],
};
const doc1: Doc1 = {
  str: 'test 1',
  thisDoc0: doc0,
};
const doc2: Doc2 = {
  str: 'test 2',
  doc1s: [doc1, { ...doc1, thisDoc0: { ...doc1.thisDoc0 } }],
};

let dependencies: Dependencies = {
  thisDoc0: 'doc0',
  doc1s: 'doc1',
};

dependencies = makeModelGQLinputDef('doc0', doc0, dependencies);
dependencies = makeModelGQLinputDef('doc1', doc1, dependencies);
dependencies = makeModelGQLinputDef('doc2', doc2, dependencies);

const schema = makeModelsGQLinputDef(dependencies);
console.log(schema);

gql`

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

input QueryDoc0Input {
  str: QueryStringInput
  bools: QueryBooleanArrayInput
}

input QueryDoc0ItemInput {
  AT: Int!
  str: QueryStringInput
  bools: QueryBooleanArrayInput
}

input QueryDoc0ArrayInput {
  SIZE: QueryIntInput
  ITEMS: [QueryDoc0ItemInput!]
  str: QueryStringInput
  bools: QueryBooleanArrayInput
}

input Doc0ChangesInput {
  str: String
  bools: [Boolean!]
}

input Doc0UpdateInput {
  id: ID!
  changes: Doc0ChangesInput!
}

input Doc0Input {
  str: String!
  bools: [Boolean!]!
}

type Doc0 {
  str: String!
  bools: [Boolean!]!
}

input QueryDoc1Input {
  str: QueryStringInput
  thisDoc0: QueryDoc0Input
}

input QueryDoc1ItemInput {
  AT: Int!
  str: QueryStringInput
  thisDoc0: QueryDoc0Input
}

input QueryDoc1ArrayInput {
  SIZE: QueryIntInput
  ITEMS: [QueryDoc1ItemInput!]
  str: QueryStringInput
  thisDoc0: QueryDoc0Input
}

input Doc1ChangesInput {
  str: String
  thisDoc0: Doc0ChangesInput
}

input Doc1UpdateInput {
  id: ID!
  changes: Doc1ChangesInput!
}

input Doc1Input {
  str: String!
  thisDoc0: Doc0!
}

type Doc1 {
  str: String!
  thisDoc0: Doc0!
}

input QueryDoc2Input {
  str: QueryStringInput
  doc1s: QueryDoc1ArrayInput
}

input QueryDoc2ItemInput {
  AT: Int!
  str: QueryStringInput
  doc1s: QueryDoc1ArrayInput
}

input QueryDoc2ArrayInput {
  SIZE: QueryIntInput
  ITEMS: [QueryDoc2ItemInput!]
  str: QueryStringInput
  doc1s: QueryDoc1ArrayInput
}

input Doc2ChangesInput {
  str: String
  doc1s: [Doc1ChangesInput!]
}

input Doc2UpdateInput {
  id: ID!
  changes: Doc2ChangesInput!
}

input Doc2Input {
  str: String!
  doc1s: [Doc1!]!
}

type Doc2 {
  str: String!
  doc1s: [Doc1!]!
}

type Query {

  getDoc0Where(query: QueryDoc0Input): [Doc0!]
  getByIdDoc0(id: ID!): Doc0
  getDoc1Where(query: QueryDoc1Input): [Doc1!]
  getByIdDoc1(id: ID!): Doc1
  getDoc2Where(query: QueryDoc2Input): [Doc2!]
  getByIdDoc2(id: ID!): Doc2
}
type Mutation {

  createDoc0(input: Doc0Input!): Doc0
  updateDoc0(update: Doc0UpdateInput!): Doc0
  deleteDoc0(id: ID!): Doc0
  createDoc0Many(inputs: [Doc0Input!]!): [Doc0!]
  updateDoc0Many(updates: [Doc0UpdateInput!]!): [Doc0!]
  deleteDoc0Many(ids: [ID!]!): [Doc0]
  updateDoc0Where(query: QueryDoc0Input!, updates: [Doc0UpdateInput!]!): [Doc0!]
  deleteDoc0Where(query: QueryDoc0Input!, ids: [ID!]!): [Doc0]

  createDoc1(input: Doc1Input!): Doc1
  updateDoc1(update: Doc1UpdateInput!): Doc1
  deleteDoc1(id: ID!): Doc1
  createDoc1Many(inputs: [Doc1Input!]!): [Doc1!]
  updateDoc1Many(updates: [Doc1UpdateInput!]!): [Doc1!]
  deleteDoc1Many(ids: [ID!]!): [Doc1]
  updateDoc1Where(query: QueryDoc1Input!, updates: [Doc1UpdateInput!]!): [Doc1!]
  deleteDoc1Where(query: QueryDoc1Input!, ids: [ID!]!): [Doc1]

  createDoc2(input: Doc2Input!): Doc2
  updateDoc2(update: Doc2UpdateInput!): Doc2
  deleteDoc2(id: ID!): Doc2
  createDoc2Many(inputs: [Doc2Input!]!): [Doc2!]
  updateDoc2Many(updates: [Doc2UpdateInput!]!): [Doc2!]
  deleteDoc2Many(ids: [ID!]!): [Doc2]
  updateDoc2Where(query: QueryDoc2Input!, updates: [Doc2UpdateInput!]!): [Doc2!]
  deleteDoc2Where(query: QueryDoc2Input!, ids: [ID!]!): [Doc2]

}
`
