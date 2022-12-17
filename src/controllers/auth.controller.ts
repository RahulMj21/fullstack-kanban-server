import { NextFunction, Request, Response } from "express";
import { Session, User } from "../models";
import { TLoginInput } from "../schemas/login.schema";
import { TRegisterInput } from "../schemas/register.schema";
import { BigPromise, CustomErrors } from "../utils";
import { createTokens, signToken, verifyToken } from "../utils/tokens";
import config from "config";

export const register = BigPromise(
    async (
        req: Request<{}, {}, TRegisterInput>,
        res: Response,
        next: NextFunction
    ) => {
        const { name, email, password } = req.body;

        const user = await User.create({ name, email, password });

        const { accessToken, refreshToken } = createTokens(user._id);

        await Session.create({ userId: user._id, token: refreshToken });

        return res
            .status(201)
            .json({ success: true, data: { accessToken, refreshToken } });
    }
);

export const login = BigPromise(
    async (
        req: Request<{}, {}, TLoginInput>,
        res: Response,
        next: NextFunction
    ) => {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return next(CustomErrors.badRequest("incorrect email"));

        const isMatched = await user.comparePassword(password);
        if (!isMatched)
            return next(CustomErrors.badRequest("incorrect password"));

        const { accessToken, refreshToken } = createTokens(user._id);

        Session.findOneAndUpdate(
            { userId: user._id },
            { token: refreshToken },
            {
                new: true,
                upsert: true,
            }
        );

        res.status(200).json({
            success: true,
            data: { accessToken, refreshToken },
        });
    }
);

export const logout = BigPromise(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) return next(CustomErrors.unauthorized());

        await Session.findOneAndDelete({ userId: user._id });

        return res.status(200).json({ success: true, message: "logged out" });
    }
);

export const refresh = BigPromise(
    async (req: Request, res: Response, next: NextFunction) => {
        const refreshToken = req.headers["X-Refresh"] || "";
        if (!refreshToken) return next(CustomErrors.unauthorized());

        const tokenData = verifyToken(
            refreshToken as string,
            config.get<string>("refreshTokenPublicKey")
        );

        if (!tokenData.data) return next(CustomErrors.unauthorized());

        const user = await User.findById(tokenData.data.id);
        if (!user) return next(CustomErrors.unauthorized());

        const session = await Session.findOne({
            userId: user._id,
            token: refreshToken,
        });
        if (!session) return next(CustomErrors.unauthorized());

        const accessToken = signToken(
            { id: user._id },
            config.get<string>("accessTokenPrivateKey")
        );

        return res.status(200).json({ success: true, data: { accessToken } });
    }
);
