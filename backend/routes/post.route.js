import express from "express"
import Post from "../models/post.model.js"
import { verifyFirebaseToken } from "../middlewares/auth.js";
import { getPostLikes, getPost, getPosts, createPost, deletePost, updatePost, uploadAuth, likePost } from "../controllers/post.controller.js";

const router = express.Router()

router.get("/upload-auth", uploadAuth);
router.get("/", getPosts);
router.get("/:blog_id", getPost)
router.post("/", verifyFirebaseToken, createPost);
router.delete("/:id", verifyFirebaseToken, deletePost);
router.put('/:id', updatePost)
router.patch("/like", verifyFirebaseToken, likePost)
router.get("/:blog_id/likes", getPostLikes);


export default router
