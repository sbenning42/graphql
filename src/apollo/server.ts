import { ApolloServer, IResolvers, gql } from "apollo-server-express";
import express from "express";
import { DocumentNode } from "graphql";

import meSchema from './modules/me/me.schema';
import meResolver from './modules/me/me.resolver';
import usersSchema from "./modules/users/users.schema";
import usersResolver from "./modules/users/users.resolver";

export class Server<Ctx = any> {
  constructor(
    public app: express.Application,
    public ctx: Ctx
  ) {
    const typeDefs: DocumentNode[] = [
      gql`
        type Query {
          hello: String!
        }
        type Mutation {
          now: Int!
        }
      `,
      usersSchema,
      meSchema,
    ];
    const resolvers: IResolvers<any, any> = {
      ...usersResolver,
      ...meResolver,
      Query: {
        hello: () => 'Hello World !',
        ...usersResolver.Query,
        ...meResolver.Query,
      },
      Mutation: {
        now: () => Date.now(),
        ...usersResolver.Mutation,
        ...meResolver.Mutation,
      }
    };
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: ctx as any
    });
    server.applyMiddleware({ app, path: "/graphql" });
  }

  listen(opts: any, fn: () => void) {
    this.app.listen(opts, fn)
  }
}
