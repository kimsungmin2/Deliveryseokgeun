import express from "express";
import cookieParser from "cookie-parser";
import LogMiddleware from "./middlewares/log.middleware.js";
import { ErrorHandlingMiddleware } from "./middlewares/error-handling.middleware.js";
import router from "./router.js";
import { redisClient } from "./redis/client.js";

const app = express();
const PORT = 3020;

app.use(LogMiddleware);
app.use(express.json());
app.use(cookieParser());
app.use("/", router);
redisClient.on("connect", () => console.log("Connected to Redis!"));
redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.connect();

app.use(ErrorHandlingMiddleware);
app.listen(PORT, () => {
    console.log(PORT, "포트로 서버가 열렸어요!");
});
