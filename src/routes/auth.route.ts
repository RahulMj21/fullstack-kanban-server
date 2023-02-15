import { Router } from "express";
import {
    login,
    logout,
    refresh,
    register,
    me,
} from "../controllers/auth.controller";
import { checkAuth, validateResource } from "../middlewares";
import { LoginSchema } from "../schemas/login.schema";
import { RegisterSchema } from "../schemas/register.schema";

const router = Router();

// POST
router.route("/register").post(validateResource(RegisterSchema), register);
router.route("/login").post(validateResource(LoginSchema), login);
router.route("/logout").post(checkAuth, logout);

// GET
router.route("/me").get(checkAuth, me);
router.route("/refresh").get(refresh);

export default router;
