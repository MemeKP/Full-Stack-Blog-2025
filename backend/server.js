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

const allowedOrigins = [
  "https://full-stack-blog-2025.vercel.app",
  "http://localhost:5173",
  "https://full-stack-blog-2025-git-working-panitas-projects.vercel.app",
  "https://full-stack-blog-2025-ljjc3my7l-panitas-projects.vercel.app", 
  "https://full-stack-blog-2025-u77o.vercel.app" //(backend URL ที่ deploy)
];

// เปิด CORS ก่อน
app.use(cors({
  origin: function(origin, callback) {
     console.log("Request Origin:", origin); 
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith("https://full-stack-blog-2025")) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
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

// allow cross-origin requests
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", 
//     "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

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


