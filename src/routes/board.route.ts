import express from "express";
import {
    createBoard,
    deleteBoard,
    getAllBoards,
    getFavouriteBoards,
    getSingleBoard,
    updateBoard,
} from "../controllers/board.controller";
import { validateResource } from "../middlewares";
import { BoardSchema } from "../schemas/board.schema";

const router = express.Router();

router.route("/").get(getAllBoards);
router.route("/:userId").get(getAllBoards);
router.route("/favourites").get(getFavouriteBoards);
router.route("/create").post(validateResource(BoardSchema), createBoard);
router.route("/:id").get(getSingleBoard).put(updateBoard).delete(deleteBoard);

export default router;
