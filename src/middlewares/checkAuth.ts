import { NextFunction, Request, Response } from "express";
import { CustomErrors } from "../utils";
import { verifyToken } from "../utils/tokens";
import config from "config";

const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization?.substring(7) || "";
        const refreshToken = req.headers["X-Refresh"] || "";

        if (!accessToken || !refreshToken)
            return next(CustomErrors.unauthorized());

        const tokenData = verifyToken(
            accessToken,
            config.get<string>("accessTokenPublicKey")
        );
        if (!tokenData.data) return next(CustomErrors.unauthorized());

        res.locals.id = tokenData.data.id;

        next();
    } catch (error: any) {
        return next(CustomErrors.unauthorized());
    }
};

export default checkAuth;
