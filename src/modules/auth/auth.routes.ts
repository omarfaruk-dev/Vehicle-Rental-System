import { Router } from "express";
import { authControllers } from "./auth.controller";

const router = Router();

router.post("/v1/auth/signin", authControllers.loginUser);

export const authRoutes = router;