import { Router } from "express";
import { feedController } from "../controllers/feed.controller.ts";
const router = Router();

router.route("/index").get(feedController);

export default router;
