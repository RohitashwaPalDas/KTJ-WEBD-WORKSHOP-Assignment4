import express from "express";
import cors from "cors";
import connectDB from "./config/connectDB.js";
import "dotenv/config";
import userRouter from "./routers/userRouter.js";
import summaryRouter from "./routers/summaryRouter.js";
import articleRouter from "./routers/articleRouter.js";

const app = express();
const port  = process.env.port || 4000;

// Middlewares 
app.use(express.json());
app.use(cors());
connectDB();

app.use("/api/user", userRouter);
app.use("/api/summary", summaryRouter);
app.use("/api/article", articleRouter);

app.get('/', (req,res)=>{
    res.send("API working");
});

app.listen(port, ()=>{
    console.log("Listening to port" + port)
});