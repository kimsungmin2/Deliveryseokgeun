import express from "express";
import cookieParser from "cookie-parser";
import LogMiddleware from "./src/middlewares/log.middleware.js";
import ErrorHandlingMiddleware from "./src/middlewares/error-handling.middleware.js";
import router from "./router.js";

const app = express();
const PORT = 3020;

app.use(LogMiddleware);
app.use(express.json());
app.use(cookieParser());
app.use("/api", router);

app.use(ErrorHandlingMiddleware);
app.listen(PORT, () => {
    console.log(PORT, "포트로 서버가 열렸어요!");
});
