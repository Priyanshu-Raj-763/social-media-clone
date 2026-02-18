import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { getMessage, sendMessage } from "../controllers/message.controllers.js";

const router = Router();

router.post("/send/:id", isAuthenticated, sendMessage)
router.get("/getMessage/:id", isAuthenticated, getMessage)

export default router;