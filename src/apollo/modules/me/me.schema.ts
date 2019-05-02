import { gql } from "apollo-server-core";

export default gql`
    
    extend type Query {
        me: User
    }
    
    extend type Mutation {
        updateMe(
            email: String,
            name: String
        ): User,
    }

`;
