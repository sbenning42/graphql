import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import { environment } from "./environments";
import { Server } from "./apollo/server";
import { makeModelGQLinputDef } from "./apollo/zto-mongodb-graphql/models/mongodb-queries";

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

let dependencies = {};
dependencies = makeModelGQLinputDef('doc0', doc0, dependencies);
dependencies = makeModelGQLinputDef('doc1', doc1, { ...dependencies, thisDoc0: dependencies['doc0'] });

console.log('***************************************************************************************************');

