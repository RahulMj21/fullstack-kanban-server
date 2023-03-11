import express from "express";
import {
    createBoard,
    deleteBoard,
    getAllBoards,
    getFavouriteBoards,
    getSingleBoard,
    updateBoard,
    updateBoardPosition,
} from "../controllers/board.controller";
import { validateResource } from "../middlewares";
import { BoardSchema } from "../schemas/board.schema";

const router = express.Router();

// POST
router.post("/create", validateResource(BoardSchema), createBoard);
// PUT
router.put("/update-position", updateBoardPosition);
router.put("/:id", updateBoard);
// DELETE
router.delete("/:id", deleteBoard);
// GET
router.get("/:id", getSingleBoard);
router.get("/favourites", getFavouriteBoards);
router.get("/:userId", getAllBoards);
router.get("/", getAllBoards);

export default router;
