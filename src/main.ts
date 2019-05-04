import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import { environment } from "./environments";
import { Server } from "./apollo/server";
import { GraphqlFactory, HasMany, HasOne } from "./apollo/zto-mongodb-graphql/models/graphql-factory";

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

let hasOne;
let hasMany;

const factory = new GraphqlFactory();

const Role = {
  name: {
    type: String,
    required: true,
  },
  ring: {
    type: Number,
    required: true,
  },
  users: () => new HasMany(Role, User, 'users', false)
};

const User = {
  name: {
    type: String,
    required: true,
  },
  roles: () => new HasMany(User, Role, 'roles', true),
  comments: () => new HasMany(User, Comment, 'comments', false),
  posts: () => new HasMany(User, Post, 'posts', false),
};

const Comment = {
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: () => new HasOne(Comment, User, 'author', true),
  relatedTo: () => new HasOne(Comment, Post, 'relatedTo', true),
};

const Post = {
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  tags: [String],
  author: () => new HasOne(Post, User, 'author', true),
  comments: () => new HasMany(Post, Comment, 'comments', false),
};

factory.absorb(
  {
    selector: 'Role',
    document: Role
  },
  {
    selector: 'User',
    document: User
  },
  {
    selector: 'Comment',
    document: Comment
  },
  {
    selector: 'Post',
    document: Post
  }
);

// Object.entries(factory.definitions).forEach(([name, def]) => console.log(name, def));
