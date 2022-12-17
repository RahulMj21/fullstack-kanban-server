import { Types } from "mongoose";

export interface IUser {
    name: string;
    email: string;
    password: string;
}
export interface IUserResponse extends Omit<IUser, "password"> {
    _id: Types.ObjectId;
    createdAt: string;
    updatedAt: string;
}

export interface ISession {
    userId: Types.ObjectId;
    token: string;
}
