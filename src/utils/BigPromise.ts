import { NextFunction, Request, Response } from "express";

const BigPromise =
    (func: Function) => (req: Request, res: Response, next: NextFunction) => {
        return Promise.resolve(func(req, res, next)).catch(next);
    };

export default BigPromise;
