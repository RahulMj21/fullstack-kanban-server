import { Router } from "express";
import {
    login,
    logout,
    refresh,
    register,
} from "../controllers/auth.controller";
import { checkAuth, validateResource } from "../middlewares";
import { LoginSchema } from "../schemas/login.schema";
import { RegisterSchema } from "../schemas/register.schema";

const router = Router();

router.route("/register").post(validateResource(RegisterSchema), register);
router.route("/login").post(validateResource(LoginSchema), login);
router.route("/logout").post(checkAuth, logout);
router.route("/refresh").post(refresh);

export default router;
