import { NextFunction, Request, Response } from "express";
import { CustomErrors } from "../utils";

const errorHandler = (
    error: CustomErrors | Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let status = 500;
    let message = "Internal Server Error";

    if (error instanceof CustomErrors) {
        status = error.status;
        message = error.message;
    }

    return res.status(status).json({ success: false, message });
};

export default errorHandler;
