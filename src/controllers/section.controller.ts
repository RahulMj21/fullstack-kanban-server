import { NextFunction, Request, Response } from "express";
import { Section, Task } from "../models";
import { BigPromise, CustomErrors } from "../utils";

export const createSection = BigPromise(
    async (
        req: Request<{ id: string }, {}, { title: string }>,
        res: Response,
        next: NextFunction
    ) => {
        const boardId = req.params.id;
        if (!boardId || boardId === "") {
            return next(CustomErrors.badRequest("please provide boardId"));
        }
        const boardTitle = req.body.title;
        if (!boardTitle || boardTitle === "") {
            return next(CustomErrors.badRequest("please provide boardTitle"));
        }

        const section = await Section.create({
            board: boardId,
            title: boardTitle,
        });
        section._doc.tasks = [];

        res.status(201).json({
            success: true,
            message: "section added",
            data: section.toJSON(),
        });
    }
);
export const updateSection = BigPromise(
    async (
        req: Request<{ id: string }, {}, { title: string }>,
        res: Response,
        next: NextFunction
    ) => {
        const sectionId = req.params.id;
        if (!sectionId || sectionId === "") {
            return next(CustomErrors.badRequest("please provide sectionId"));
        }
        const boardTitle = req.body.title;
        if (!boardTitle || boardTitle === "") {
            return next(CustomErrors.badRequest("nothing to update"));
        }

        const section = await Section.findByIdAndUpdate(sectionId, {
            title: boardTitle,
        });
        if (section) {
            section._doc.tasks = [];
            return res.status(200).json({
                success: true,
                message: "section added",
                data: section.toJSON(),
            });
        } else {
            return CustomErrors.notFound("section not found");
        }
    }
);
export const deleteSection = BigPromise(
    async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
        const sectionId = req.params.id;
        if (!sectionId || sectionId === "") {
            return next(CustomErrors.badRequest("please provide sectionId"));
        }

        const section = await Section.findById(sectionId);
        if (!section) return next(CustomErrors.badRequest("section not found"));

        await Task.deleteMany({ section: section._id });

        await section.remove();

        return res
            .status(200)
            .json({ success: true, message: "section deleted" });
    }
);
