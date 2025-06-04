// import express from "express"
// const router = express.Router()
// export default router
import express from "express";
import User from "../models/user.model.js";
import { verifyFirebaseToken } from "../middlewares/auth.js";
import { createOrUpdateUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const users = await User.find()
        res.status(200).json(users)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

router.post("/user", verifyFirebaseToken, createOrUpdateUser);


export default router;
