import { Router } from "express";
import {
  createPost,
  specificPost,
  deletePost,
} from "../controllers/post.controller.ts";

const router = Router();

router.route("/create").post(createPost);
router.route("/fetch/:id").get(specificPost);
router.route("/deletepost/:id").delete(deletePost);

export default router;
