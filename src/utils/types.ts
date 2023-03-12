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

export interface ITask {
    section: Types.ObjectId;
    title: string;
    content: string;
    position?: number;
}

export interface IBoard {
    user: Types.ObjectId;
    icon: string;
    title: string;
    description: string;
    position?: number;
    favourite: boolean;
    favouritePosition: number;
    _doc?: any;
}

export interface ISection {
    board: Types.ObjectId;
    title: string;
    _doc?: any;
}
