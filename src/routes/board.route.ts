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

router.route("/:id").get(getSingleBoard).put(updateBoard).delete(deleteBoard);
router.route("/:userId").get(getAllBoards);
router.route("/favourites").get(getFavouriteBoards);
router.route("/create").post(validateResource(BoardSchema), createBoard);
router.route("/update-position").put(updateBoardPosition);
router.route("/").get(getAllBoards);

export default router;
