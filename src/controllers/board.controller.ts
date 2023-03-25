import { NextFunction, Request, Response } from "express";
import { Board, Section, Task } from "../models";
import { TCreateBoardInput } from "../schemas/board.schema";
import { TUpdateBoardInput } from "../schemas/updateBoard.schema";
import { BigPromise, CustomErrors } from "../utils";

export const createBoard = BigPromise(
    async (
        req: Request<{}, {}, TCreateBoardInput>,
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
        req: Request,
        res: Response<{}, { id: string }>,
        next: NextFunction
    ) => {
        const boards = await Board.find({ user: res.locals.id })
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

export const getFavouriteBoards = BigPromise(
    async (
        req: Request,
        res: Response<{}, { id: string }>,
        next: NextFunction
    ) => {
        const filter = { favourite: true, user: res.locals.id };
        const boards = await Board.find(filter)
            .populate({
                path: "user",
                select: { _id: 1, name: 1 },
            })
            .sort({ favouritePosition: "asc" });
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

        const sections = await Section.find({ board: board._id });
        for (const section of sections) {
            const tasks = await Task.find({ section: section._id })
                .populate("section")
                .sort({ position: "asc" });
            section._doc.tasks = tasks;
        }
        board._doc.sections = sections;

        return res.status(200).json({ success: true, data: board.toJSON() });
    }
);

export const updateBoard = BigPromise(
    async (
        req: Request<{ id: string }, {}, TUpdateBoardInput>,
        res: Response,
        next: NextFunction
    ) => {
        const boardId = req.params.id;
        if (!boardId || boardId === "")
            return next(CustomErrors.badRequest("boardId cannot be empty"));
        const currentBoard = await Board.findById(boardId);
        if (!currentBoard)
            return next(CustomErrors.notFound("board not found"));

        const { description, icon, title, favourite } = req.body;
        const updateObj: Record<string, string | number | boolean> = {};

        if (typeof title !== "undefined" && title !== "") {
            updateObj.title = title;
        }
        if (typeof description !== "undefined") {
            updateObj.description = description;
        }
        if (typeof icon !== "undefined" && icon !== "") {
            updateObj.icon = icon;
        }
        if (
            typeof favourite !== "undefined" &&
            currentBoard.favourite !== favourite
        ) {
            updateObj.favourite = favourite;
            const favourites = await Board.find({
                user: currentBoard.user,
                favourite: true,
                _id: { $ne: boardId },
            });
            if (favourite) {
                updateObj.favouritePosition =
                    favourites.length > 0 ? favourites.length : 0;
            } else {
                for (const key in favourites) {
                    const favouriteBoard = favourites[key];
                    await favouriteBoard.update({
                        favouritePosition: key,
                    });
                }
            }
        }

        const updatedBoard = await Board.findByIdAndUpdate(boardId, {
            $set: updateObj,
        });
        if (!updatedBoard)
            return next(CustomErrors.wentWrong("failed to update board"));

        return res.status(200).json({
            success: true,
            message: "board updated",
        });
    }
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

export const updateFavouriteBoardPosition = BigPromise(
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
                $set: { favouritePosition: key },
            });
        }

        return res.status(200).json({
            status: "success",
            message: "position updated",
        });
    }
);

export const deleteBoard = BigPromise(
    async (
        req: Request<{ id: string }>,
        res: Response<{}, { id: string }>,
        next: NextFunction
    ) => {
        const userId = res.locals.id;

        const id = req.params.id;
        if (id === "")
            return next(CustomErrors.badRequest("board_id cannot be empty"));

        const board = await Board.findById(id);
        if (!board) return next(CustomErrors.notFound());

        if (board.user.toHexString() !== String(userId))
            return next(new CustomErrors(403, "permission denied"));

        const sections = await Section.find({ board: board._id });
        if (sections && sections.length > 0) {
            for (const section of sections) {
                await Task.deleteMany({ section: section._id }).then(() => {
                    section.remove();
                });
            }
        }

        if (board.favourite) {
            const favouriteBoards = await Board.find({
                user: userId,
                favourite: true,
                _id: { $ne: board._id },
            });
            if (favouriteBoards && favouriteBoards.length > 0) {
                for (const key in favouriteBoards) {
                    const favouriteBoard = favouriteBoards[key];
                    await favouriteBoard.update({
                        $set: { favouritePosition: key },
                    });
                }
            }
        }

        const boards = await Board.find({
            user: userId,
            _id: { $ne: board._id },
        });
        if (boards && boards.length > 0) {
            for (const key in boards) {
                const item = boards[key];
                await item.update({ $set: { position: key } });
            }
        }
        await board.remove();

        return res
            .status(200)
            .json({ success: true, message: "board deleted" });
    }
);
