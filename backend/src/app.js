import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import interviewRouter from "./routes/interview.routes.js";

const app = express();

app.use(cors());

app.use(express.json({
    limit: "16kb"
}));

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}));

app.use(express.static("public"));

app.use(cookieParser());
app.use("/api/interview", interviewRouter);

export default app;