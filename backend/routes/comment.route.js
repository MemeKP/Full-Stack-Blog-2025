import express from "express"
import { verifyFirebaseToken } from "../middlewares/auth.js"
import { addComment, getPostComments, deleteComment } from "../controllers/comment.controller.js"

const router = express.Router()

router.get("/:postId", getPostComments)
router.post("/:postId", verifyFirebaseToken, addComment)
router.delete("/:id", verifyFirebaseToken, deleteComment)

export default router