import { Context } from "../../context";
import { User, UserUpdate, UserDocument } from "./user";
import uuidv4 from 'uuid/v4';

let users: User[] = [
    {
        id: '1',
        email: 'sben@sben.sben',
        name: 'sben',
        phone: 0,
    },
    {
        id: '2',
        email: 'test@test.test',
        name: 'test',
        phone: 0,
    },
];

export const getUsers = () => users;

export const byId = (id: string) => (user: User) => user.id === id;

export default {

    Query: {
        Users: (_: any, { query }: any, ctx: Context) => {
            const rootResults = [];
            const rootNotResults = [];
            if (query && query.EQ) {
                rootResults.push(...users.filter(user => Object.entries(query.EQ || {}).every(([prop, value]) => user[prop] === value)));
            }
            if (query && query.NEQ) {
                rootNotResults.push(...users.filter(user => Object.entries(query.NEQ || {}).every(([prop, value]) => user[prop] === value)));
            }
            const valueQuery = Object.entries(query || {})
                .filter(([op]) => op !== 'EQ' && op !== 'NEQ');
            rootResults.push(...users.filter(user => valueQuery.length > 0 && valueQuery
                .every(([prop, thisQuery]) => {
                    const results = [];
                    const notResults = [];
                    if ((thisQuery as any).value) {
                        results.push((thisQuery as any).value);
                    }
                    if ((thisQuery as any).EQ) {
                        results.push((thisQuery as any).EQ);
                    }
                    if ((thisQuery as any).NEQ) {
                        notResults.push((thisQuery as any).NEQ);
                    }
                    return notResults.length > 0
                        ? (results.length > 0
                            ? !notResults.includes(user[prop]) && results.includes(user[prop])
                            : !notResults.includes(user[prop])
                        )
                        : results.includes(user[prop]);
                })
            ));
            return (!query.EQ && valueQuery.length === 0 ? users : rootResults).filter(rr => !rootNotResults.includes(rr));
        },
        User: (_: any, { id }: { id: string }, ctx: Context) => users.find(byId(id)),
    },

    Mutation: {
        
        CreateUsers: (_: any, { documents }: { documents: UserDocument[] }, ctx: Context) => {
            const newUsers = documents.map(document => ({ ...document, id: uuidv4() }));
            users.push(...newUsers);
            return newUsers;
        },
        
        UpdateUsers: (_: any, { updates }: { updates: UserUpdate[] }, ctx: Context) => {
            const thisUsers = updates
                .filter(({ id }) => users.some(byId(id)))
                .map(({ id, changes }) => {
                    const user = users.find(byId(id));
                    user.email = changes.email !== undefined ? changes.email : user.email;
                    user.name = changes.name !== undefined ? changes.name : user.name;
                    return user
                });
            return thisUsers;
        },
        
        DeleteUsers: (_: any, { ids }: { ids: string[] }, ctx: Context) => {
            const thisUsers = users.filter(({ id }) => ids.includes(id));
            users = users.filter(({ id }) => !ids.includes(id));
            return thisUsers;
        },
        
        CreateUser: (_: any, { document }: { document: UserDocument }, ctx: Context) => {
            const newUser = { ...document, id: uuidv4() };
            users.push(newUser);
            return newUser;
        },
        
        UpdateUser: (_: any, { update }: { update: UserUpdate }, ctx: Context) => {
            const user = users.find(byId(update.id));
            if (user) {
                user.email = update.changes.email !== undefined ? update.changes.email : user.email;
                user.name = update.changes.name !== undefined ? update.changes.name : user.name;
            }
            return user;
        },
        
        DeleteUser: (_: any, { id }: { id: string }, ctx: Context) => {
            const user = users.find(byId(id));
            users = users.filter(({ id: userId }) => id !== userId);
            return user;
        },

    },

};
