import { gql } from "apollo-server-core";

export default gql`

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
    # Use for indexed array's item queries
    # eg:
    # Post.find({ "comments.0.author": "toto" });
    # getPostWhere(query: { comments { ITEMS: [{ AT: 0, name: "toto" }] } })
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
    # Use for indexed array's item queries
    # eg:
    # Post.find({ "comments.0.author": "toto" });
    # getPostWhere(query: { comments { ITEMS: [{ AT: 0, name: "toto" }] } })
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


input QueryRoleInputRoot {
    name: QueryStringInput
    ring: QueryIntInput
    pagination: QueryPagination
}

input QueryRoleInput {
    name: QueryStringInput
    ring: QueryIntInput
}

input RoleSortInput {
    name: Int
    ring: Int
}

input QueryRoleItemInput {
    AT: Int!
    name: QueryStringInput
    ring: QueryIntInput
}

input QueryRoleArrayInput {
    SIZE: QueryIntInput
    ITEMS: [QueryRoleItemInput!]
    name: QueryStringInput
    ring: QueryIntInput
}

input RoleChangesInput {
    name: String
    ring: Int
}

input RoleUpdateInput {
    id: ID!
    changes: RoleChangesInput!
}

input RoleInput {
    name: String!
    ring: Int!
}

type Role {
    name: String!
    ring: Int!
}

input QueryUserInputRoot {
    name: QueryStringInput
    email: QueryStringInput
    roles: QueryRoleArrayInput
    pagination: QueryPagination
}

input QueryUserInput {
    name: QueryStringInput
    email: QueryStringInput
    roles: QueryRoleArrayInput
}

input UserSortInput {
    name: Int
    email: Int
    roles: RoleSortInput
}

input QueryUserItemInput {
    AT: Int!
    name: QueryStringInput
    email: QueryStringInput
    roles: QueryRoleArrayInput
}

input QueryUserArrayInput {
    SIZE: QueryIntInput
    ITEMS: [QueryUserItemInput!]
    name: QueryStringInput
    email: QueryStringInput
    roles: QueryRoleArrayInput
}

input UserChangesInput {
    name: String
    email: String
    roles: [RoleChangesInput!]
}

input UserUpdateInput {
    id: ID!
    changes: UserChangesInput!
}

input UserInput {
    name: String!
    email: String!
    roles: [Role!]!
}

type User {
    name: String!
    email: String!
    roles: [Role!]!
}

input QueryCommentInputRoot {
    name: QueryStringInput
    content: QueryStringInput
    author: QueryUserInput
    pagination: QueryPagination
}

input QueryCommentInput {
    name: QueryStringInput
    content: QueryStringInput
    author: QueryUserInput
}

input CommentSortInput {
    name: Int
    content: Int
    author: UserSortInput
}

input QueryCommentItemInput {
    AT: Int!
    name: QueryStringInput
    content: QueryStringInput
    author: QueryUserInput
}

input QueryCommentArrayInput {
    SIZE: QueryIntInput
    ITEMS: [QueryCommentItemInput!]
    name: QueryStringInput
    content: QueryStringInput
    author: QueryUserInput
}

input CommentChangesInput {
    name: String
    content: String
    author: UserChangesInput
}

input CommentUpdateInput {
    id: ID!
    changes: CommentChangesInput!
}

input CommentInput {
    name: String!
    content: String!
    author: User!
}

type Comment {
    name: String!
    content: String!
    author: User!
}

input QueryPostInputRoot {
    name: QueryStringInput
    author: QueryUserInput
    followers: QueryUserArrayInput
    comments: QueryCommentArrayInput
    pagination: QueryPagination
}

input QueryPostInput {
    name: QueryStringInput
    author: QueryUserInput
    followers: QueryUserArrayInput
    comments: QueryCommentArrayInput
}

input PostSortInput {
    name: Int
    author: UserSortInput
    followers: UserSortInput
    comments: CommentSortInput
}

input QueryPostItemInput {
    AT: Int!
    name: QueryStringInput
    author: QueryUserInput
    followers: QueryUserArrayInput
    comments: QueryCommentArrayInput
}

input QueryPostArrayInput {
    SIZE: QueryIntInput
    ITEMS: [QueryPostItemInput!]
    name: QueryStringInput
    author: QueryUserInput
    followers: QueryUserArrayInput
    comments: QueryCommentArrayInput
}

input PostChangesInput {
    name: String
    author: UserChangesInput
    followers: [UserChangesInput!]
    comments: [CommentChangesInput!]
}

input PostUpdateInput {
    id: ID!
    changes: PostChangesInput!
}

input PostInput {
    name: String!
    author: User!
    followers: [User!]!
    comments: [Comment!]!
}

type Post {
    name: String!
    author: User!
    followers: [User!]!
    comments: [Comment!]!
}

type Query {
    getRoleWhere(query: QueryRoleInputRoot): [Role!]
    getByIdRole(id: ID!): Role
    getUserWhere(query: QueryUserInputRoot): [User!]
    getByIdUser(id: ID!): User
    getCommentWhere(query: QueryCommentInputRoot): [Comment!]
    getByIdComment(id: ID!): Comment
    getPostWhere(query: QueryPostInputRoot): [Post!]
    getByIdPost(id: ID!): Post
}
type Mutation {
    createRole(input: RoleInput!): Role
    updateRole(update: RoleUpdateInput!): Role
    deleteRole(id: ID!): Role
    createRoleMany(inputs: [RoleInput!]!): [Role!]
    updateRoleMany(updates: [RoleUpdateInput!]!): [Role!]
    deleteRoleMany(ids: [ID!]!): [Role]
    updateRoleWhere(query: QueryRoleInput!, changes: RoleChangesInput!): [Role!]
    deleteRoleWhere(query: QueryRoleInput!): [Role]
    createUser(input: UserInput!): User
    updateUser(update: UserUpdateInput!): User
    deleteUser(id: ID!): User
    createUserMany(inputs: [UserInput!]!): [User!]
    updateUserMany(updates: [UserUpdateInput!]!): [User!]
    deleteUserMany(ids: [ID!]!): [User]
    updateUserWhere(query: QueryUserInput!, changes: UserChangesInput!): [User!]
    deleteUserWhere(query: QueryUserInput!): [User]
    createComment(input: CommentInput!): Comment
    updateComment(update: CommentUpdateInput!): Comment
    deleteComment(id: ID!): Comment
    createCommentMany(inputs: [CommentInput!]!): [Comment!]
    updateCommentMany(updates: [CommentUpdateInput!]!): [Comment!]
    deleteCommentMany(ids: [ID!]!): [Comment]
    updateCommentWhere(query: QueryCommentInput!, changes: CommentChangesInput!): [Comment!]
    deleteCommentWhere(query: QueryCommentInput!): [Comment]
    createPost(input: PostInput!): Post
    updatePost(update: PostUpdateInput!): Post
    deletePost(id: ID!): Post
    createPostMany(inputs: [PostInput!]!): [Post!]
    updatePostMany(updates: [PostUpdateInput!]!): [Post!]
    deletePostMany(ids: [ID!]!): [Post]
    updatePostWhere(query: QueryPostInput!, changes: PostChangesInput!): [Post!]
    deletePostWhere(query: QueryPostInput!): [Post]
}
`;