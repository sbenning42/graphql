import { Mongoose } from "mongoose";

export interface Context {
  mongose: Promise<Mongoose>;
}
