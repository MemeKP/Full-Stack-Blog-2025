import express from "express"
import Post from "../models/post.model.js"
import { verifyFirebaseToken } from "../middlewares/auth.js";
import { getPosts, createPost, deletePost, updatePost } from "../controllers/post.controller.js";

const router = express.Router()

router.get("/", getPosts);
router.get("/:slug", getPosts)
router.post("/", verifyFirebaseToken, createPost);
router.delete("/:id", deletePost);
router.put('/:id', updatePost)

export default router