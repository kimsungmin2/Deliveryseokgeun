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

router.post("/", authMiddleware, ordersController.neworder);

//음식점 검색기능
router.post("/store/search", ordersController.searchData);

//카테고리 검색기능
router.post("/store/search", async (req, res, next) => {
  const storeCategory = req.body;
});

export default router;
