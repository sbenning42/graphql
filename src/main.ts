import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import { environment } from "./environments";
import { Server } from "./apollo/server";

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
