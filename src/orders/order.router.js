import express from "express";
import { prisma } from "../../prisma/index.js";
import { OrdersController } from "./order.controller.js";
import { OrdersRepository } from "./order.repository.js";
import { OrdersService } from "./order.service.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";

const router = express.Router();

const ordersRepository = new OrdersRepository(prisma);

const ordersService = new OrdersService(ordersRepository);

const ordersController = new OrdersController(ordersService);

// router.post("/", authMiddleware, ordersController.neworder);

//음식점 검색기능
router.post("/search", ordersController.searchData);

//카테고리 검색기능(추후 만들기)
// router.post("/store/search", async (req, res, next) => {
//   const storeCategory = req.body;
// });

//주문 배달메뉴 조회
router.get("/:storeId/ordered", authMiddleware, ordersController.getOrderData);

export default router;
