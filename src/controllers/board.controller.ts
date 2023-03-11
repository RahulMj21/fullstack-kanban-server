import { NextFunction, Request, Response } from "express";
import { Board } from "../models";
import { TICreateBoardInput } from "../schemas/board.schema";
import { BigPromise, CustomErrors } from "../utils";

export const createBoard = BigPromise(
    async (
        req: Request<{}, {}, TICreateBoardInput>,
        res: Response,
        next: NextFunction
    ) => {
        const boardsCount = await Board.find().count();
        const board = await Board.create({
            ...req.body,
            user: res.locals.id,
            position: boardsCount > 0 ? boardsCount : 0,
        });
        if (!board) return next(CustomErrors.wentWrong("cannot create board"));

        const populatedBoard = await board.populate({
            path: "user",
            select: { _id: 1, name: 1 },
        });

        return res
            .status(201)
            .json({ success: true, data: populatedBoard.toJSON() });
    }
);

export const getAllBoards = BigPromise(
    async (req: Request, res: Response, next: NextFunction) => {
        const boards = await Board.find()
            .populate({
                path: "user",
                select: { _id: 1, name: 1 },
            })
            .sort({ position: "asc" });
        if (!boards)
            return next(CustomErrors.wentWrong("unable to get boards"));

        return res.status(200).json({ success: true, data: boards });
    }
);

export const getMyBoards = BigPromise(
    async (
        req: Request<{ userId: string }>,
        res: Response,
        next: NextFunction
    ) => {
        const userId = req.params.userId;
        if (!userId || userId === "")
            return next(CustomErrors.badRequest("user_id cannot be empty"));

        const boards = await Board.find({ user: userId }).populate({
            path: "user",
            select: { _id: 1, name: 1 },
        });
        if (!boards)
            return next(CustomErrors.wentWrong("unable to get boards"));

        return res.status(200).json({ success: true, data: boards });
    }
);

export const getFavouriteBoards = BigPromise(
    async (req: Request, res: Response, next: NextFunction) => {
        const filter = { favourite: true };
        const boards = await Board.find(filter).populate({
            path: "user",
            select: { _id: 1, name: 1 },
        });
        if (!boards)
            return next(CustomErrors.wentWrong("unable to get boards"));

        return res.status(200).json({ success: true, data: boards });
    }
);

export const getSingleBoard = BigPromise(
    async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
        const id = req.params.id;
        if (!id || id === "" || typeof id === "undefined")
            return next(CustomErrors.badRequest("board_id cannot be empty"));

        const board = await Board.findById(id).populate({
            path: "user",
            select: { _id: 1, name: 1 },
        });
        if (!board) return next(CustomErrors.notFound());
        return res.status(200).json({ success: true, data: board.toJSON() });
    }
);

export const updateBoard = BigPromise(
    async (req: Request, res: Response, next: NextFunction) => {}
);

export const updateBoardPosition = BigPromise(
    async (
        req: Request<{}, {}, { boards: { _id: string }[] }>,
        res: Response,
        next: NextFunction
    ) => {
        const boards = req.body.boards;

        if (!boards) return next(CustomErrors.badRequest("nothing to update"));
        for (const key in boards) {
            const board = boards[key];
            await Board.findByIdAndUpdate(board._id, {
                $set: { position: key },
            });
        }

        return res.status(200).json({
            status: "success",
            message: "position updated",
        });
    }
);

export const deleteBoard = BigPromise(
    async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
        const userId = res.locals.id;
        if (!userId) return next(CustomErrors.unauthorized());

        const id = req.params.id;
        if (id === "")
            return next(CustomErrors.badRequest("board_id cannot be empty"));

        const board = await Board.findById(id);
        if (!board) return next(CustomErrors.notFound());

        if (board.user.toHexString() !== String(userId))
            return next(new CustomErrors(403, "permission denied"));

        await board.remove();

        return res
            .status(200)
            .json({ success: true, message: "board deleted" });
    }
);
