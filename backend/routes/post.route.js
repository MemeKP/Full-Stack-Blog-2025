import express from "express"
import Post from "../models/post.model.js"
import { getPosts, createPost, deletePost } from "../controllers/post.controller.js";

const router = express.Router()

router.get("/", getPosts);
router.get("/:slug", getPosts)
router.post("/", createPost);
router.delete("/:id", deletePost);

export default router