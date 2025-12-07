import { Router } from "express";
import { userControllers } from "./user.controller";
import auth from "../../middleware/auth";

const router = Router();

router.post("/v1/auth/signup", userControllers.createUser);
router.get("/users", userControllers.getAllUser);
router.put(
    "/users/:userId",
    auth("admin", "customer"),
    userControllers.updateUser
);

router.delete('/users/:userId', auth('admin'), userControllers.deleteUser)

export const userRoutes = router;