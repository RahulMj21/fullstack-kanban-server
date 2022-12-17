import jwt, { SignOptions } from "jsonwebtoken";
import config from "config";
import { Types } from "mongoose";

export const signToken = (
    data: any,
    secret: string,
    options: SignOptions = {}
) => {
    const token = jwt.sign(
        data,
        Buffer.from(secret, "base64").toString("ascii"),
        { algorithm: "RS256", expiresIn: 1000 * 60 * 60, ...options }
    );
    return token;
};

export const createTokens = (id: Types.ObjectId) => {
    const accessToken = signToken(
        { id },
        config.get<string>("accessTokenPrivateKey")
    );

    const refreshToken = signToken(
        { id },
        config.get<string>("accessTokenPrivateKey"),
        { expiresIn: 1000 * 60 * 60 * 24 * 30 }
    );

    return { accessToken, refreshToken } as const;
};

export const verifyToken = (token: string, secret: string) => {
    const decoded = jwt.verify(
        token,
        Buffer.from(secret, "base64").toString("ascii")
    );

    return decoded
        ? { data: decoded as unknown as { id: string } }
        : { data: null };
};
