import { NextFunction, Request, Response } from "express";
import { CustomErrors } from "../utils";

interface IGetUserAuthInfoRequest extends Request {
    user: any;
}

const checkUserRole = (...roles: string[]) => {
    return (
        req: IGetUserAuthInfoRequest,
        _res: Response,
        next: NextFunction
    ) => {
        if (!roles.includes(req.user.role)) {
            return next(new CustomErrors(403, "Forbidden Route"));
        }
    };
};

export default checkUserRole;
