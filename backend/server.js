import express from "express"
import userRouter from "./routes/user.route.js"
import postRouter from "./routes/post.route.js"
import commentRouter from "./routes/comment.route.js"
import connectDB from "./lib/connectDB.js"
import dotenv from "dotenv";
import mongoose from "mongoose"
import cors from "cors";

dotenv.config()
const app = express()

// เปิด CORS ก่อน
app.use(cors({
  origin: "http://localhost:5173", // origin ของ frontend (Vite ใช้ port 5173)
  credentials: true,
}));

app.use(express.json())

// allow cross-origin requests
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", 
    "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// app.get("/test", (req, res) => {
//     res.status(200).send("It works!")
// } )

// mongoose.connect(process.env.DB_LOCATION) //มีใน lib/connectDB แล้ว
//     .then(()=> console.log("MongoDB conneted!"))
//     .catch(err => console.error("Mongo error: ", err))
// app.use(cors({
//   origin: "http://localhost:5173", // หรือ port ที่ frontend ใช้
//   credentials: true,
// }));
    
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


