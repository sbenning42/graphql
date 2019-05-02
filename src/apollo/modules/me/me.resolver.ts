import { Context } from "../../context";
import { User } from "../users/user";
import { getUsers } from "../users/users.resolver";

const me = () => getUsers()[0];

export default {

    Query: {
        me: (_: any, {}: {}, ctx: Context) => me(),
    },

    Mutation: {
        updateMe: (_: any, { name, email }: User, ctx: Context) => {
            const thisMe = me();
            thisMe.email = email !== undefined ? email : thisMe.email;
            thisMe.name = name !== undefined ? name : thisMe.name;
            return thisMe;
        },
    },

};
