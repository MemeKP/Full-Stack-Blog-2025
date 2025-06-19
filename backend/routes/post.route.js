import express from "express"
import Post from "../models/post.model.js"
import { verifyFirebaseToken } from "../middlewares/auth.js";
import { getPost, getPosts, createPost, deletePost, updatePost, uploadAuth } from "../controllers/post.controller.js";

const router = express.Router()

router.get("/upload-auth", uploadAuth);
router.get("/", getPosts);
// router.get("/:slug", getPosts)
router.get("/:blog_id", getPost)
router.post("/", verifyFirebaseToken, createPost);
router.delete("/:id", verifyFirebaseToken, deletePost);
router.put('/:id', updatePost)

export default router