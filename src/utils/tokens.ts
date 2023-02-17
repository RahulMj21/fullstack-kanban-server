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
        { algorithm: "RS256", ...options }
    );
    return token;
};

export const createTokens = (id: Types.ObjectId) => {
    const accessToken = signToken(
        { id },
        config.get<string>("accessTokenPrivateKey"),
        { expiresIn: config.get<number>("accessTokenExpiry") }
    );

    const refreshToken = signToken(
        { id },
        config.get<string>("refreshTokenPrivateKey"),
        { expiresIn: config.get<number>("refreshTokenExpiry") }
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
