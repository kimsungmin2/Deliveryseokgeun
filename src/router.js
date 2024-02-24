import express from "express";
import UsersRouter from "./users/user.router.js";
import StoresRouter from "./stores/store.router.js";
import OrdersRouter from "./orders/order.router.js";
import MenusRouter from "./menus/menu.router.js";
import ReviewRouter from "./review/review.router.js";

const router = express.Router();

router.use("/stores", StoresRouter);

router.use("/users", UsersRouter);

router.use("/orders", OrdersRouter);

router.use("/menus", MenusRouter);

router.use("/reviews", ReviewRouter);

export default router;
