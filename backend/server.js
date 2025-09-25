import express from "express"
import userRouter from "./routes/user.route.js"
import postRouter from "./routes/post.route.js"
import commentRouter from "./routes/comment.route.js"
import connectDB from "./lib/connectDB.js"
import dotenv from "dotenv";
import cors from "cors";

dotenv.config()
const app = express()

// เปิด CORS ก่อน
app.use(cors({
  origin: ["https://blog-app-sigma-topaz.vercel.app", "http://localhost:5173"],
  credentials: true
}));

app.use(express.json())
    
app.use("/users", userRouter)
app.use("/posts", postRouter)
app.use("/comments", commentRouter)

app.use((error, req, res, next) => {
    res.status(error.status || 500);

    res.json({
        message: error.message || "something went wrong!",
        status: error.status,
        stack: error.stack,
    })
})

app.listen(3000,() => {
    connectDB()
    console.log("Server is running!")
})

