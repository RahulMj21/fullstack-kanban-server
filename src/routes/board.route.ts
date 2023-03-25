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
    updateFavouriteBoardPosition,
} from "../controllers/board.controller";
import { validateResource } from "../middlewares";
import { CreateBoardSchema } from "../schemas/board.schema";

const router = express.Router();

router.post("/create", validateResource(CreateBoardSchema), createBoard);
router.put("/update-favourite-position", updateFavouriteBoardPosition);
router.put("/update-position", updateBoardPosition);
router.get("/favourites", getFavouriteBoards);
router.get("/my-boards", getMyBoards);
router.put("/:id", updateBoard);
router.delete("/:id", deleteBoard);
router.get("/:id", getSingleBoard);
router.get("/", getAllBoards);

export default router;
