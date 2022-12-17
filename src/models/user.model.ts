import { Schema, model, HydratedDocument } from "mongoose";
import { IUser } from "../utils/types";
import argon from "argon2";

interface UserModel extends IUser {
    comparePassword: (password: string) => Promise<boolean>;
}

const userSchema = new Schema<UserModel>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function (next) {
    const user = this;
    if (!user.isModified("password")) return next();
    user.password = await argon.hash(user.password);
    return next();
});

userSchema.methods.comparePassword = async function (password: string) {
    const user = this as HydratedDocument<UserModel>;
    const isMatched = await argon.verify(user.password, password);
    return isMatched;
};

const userModel = model<UserModel>("User", userSchema);

export default userModel;
