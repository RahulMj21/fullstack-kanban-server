import express from "express";
import {
    createSection,
    deleteSection,
    updateSection,
} from "../controllers/section.controller";
import { validateResource } from "../middlewares";
import { SectionSchema } from "../schemas/section.schema";

const router = express.Router();

router.put("/:id", validateResource(SectionSchema), updateSection);
router.post("/:board_id", validateResource(SectionSchema), createSection);
router.delete("/:id", deleteSection);

export default router;
