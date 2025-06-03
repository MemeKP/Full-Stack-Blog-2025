// import express from "express"

// const router = express.Router()

// export default router
import express from "express";
import User from "../models/user.model.js";

const router = express.Router();

// router.post("/", async (req, res) => {
//   try {
//     const user = new User(req.body);
//     const saved = await user.save();
//     res.status(201).json(saved);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

router.get("/", async (req, res) => {
    try {
        const users = await User.find()
        res.status(200).json(users)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})


export default router;
