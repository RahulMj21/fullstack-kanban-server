import express from "express";
import {
    createBoard,
    deleteBoard,
    getAllBoards,
    getFavouriteBoards,
    getMyBoards,
    getSingleBoard,
    updateBoard,
    updateBoardPosition,
} from "../controllers/board.controller";
import { validateResource } from "../middlewares";
import { CreateBoardSchema } from "../schemas/board.schema";

const router = express.Router();

// POST
router.post("/create", validateResource(CreateBoardSchema), createBoard);
// PUT
router.put("/update-position", updateBoardPosition);
router.put("/:id", updateBoard);
// DELETE
router.delete("/:id", deleteBoard);
// GET
router.get("/:id", getSingleBoard);
router.get("/favourites", getFavouriteBoards);
router.get("/:userId", getMyBoards);
router.get("/", getAllBoards);

export default router;
