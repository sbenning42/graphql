export interface UserDocument {
    email: string;
    name: string;
    phone: number;
}

export class Int extends Number {}

export const UserSchema = {
    email: String,
    name: String,
    phone: Int,
}

export interface UserChanges {
    email?: string;
    name?: string;
    phone?: number;
}

export interface UserUpdate {
    id: string;
    changes: UserChanges;
}

export interface IUser extends UserDocument {
    id: string;
}

export class User implements IUser {
    constructor(
        public id: string,
        public email: string,
        public name: string,
        public phone: number,
    ) {}
}