import express from "express"
import userRouter from "./routes/user.route.js"
import postRouter from "./routes/post.route.js"
import commentRouter from "./routes/comment.route.js"
import connectDB from "./lib/connectDB.js"
import dotenv from "dotenv";
import cors from "cors";

dotenv.config()
const app = express();

// // เปิด CORS ก่อน
// app.use(cors({
//   origin: ["https://blog-app-sigma-topaz.vercel.app", "http://localhost:5173"],
//   credentials: true
// }));

// app.use(express.json())
    
// app.use("/users", userRouter)
// app.use("/posts", postRouter)
// app.use("/comments", commentRouter)
// เปิด CORS ก่อน 
app.use(cors({ 
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      "https://blog-app-sigma-topaz.vercel.app", // Production URL
      "http://localhost:5173", // Local development
      /^https:\/\/.*-panitas-projects\.vercel\.app$/ // Preview deployments
    ];
    
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (typeof allowedOrigin === 'string') {
        return origin === allowedOrigin;
      }
      if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
      }
      return false;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin'
  ]
}));

// app.options('*', cors());

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Query:`, req.query);
  next();
});
     
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/comments", commentRouter);

app.use((error, req, res, next) => {
    res.status(error.status || 500);

    res.json({
        message: error.message || "something went wrong!",
        status: error.status,
        stack: error.stack,
    })
})

/**FOR DEV */
app.listen(3000,() => {
    connectDB()
    console.log("Server is running!")
})

/**FOR DEPLOY */
// connectDB()
//  console.log("Server is running!");

export default app;
