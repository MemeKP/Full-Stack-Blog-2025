import express from "express";
import User from "../models/user.model.js";
import { verifyFirebaseToken } from "../middlewares/auth.js";
import { createOrUpdateUser, getUserLikedPosts, getUserSavedPosts, SavePosts } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/user", verifyFirebaseToken, createOrUpdateUser);
router.get("/saved", verifyFirebaseToken, getUserSavedPosts)
router.patch("/save",verifyFirebaseToken, SavePosts)
router.get("/liked", verifyFirebaseToken, getUserLikedPosts)


export default router;
