import express from "express";
import { prisma } from "../../prisma/index.js";
import { OrdersController } from "./order.controller.js";
import { OrdersRepository } from "./order.repository.js";
import { OrdersService } from "./order.service.js";
import { UsersRepository } from "../users/user.repository.js";
import { MenusRepository } from "../menus/menu.repository.js";
import { StoresRepository } from "../stores/store.repository.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";
import { PointsRepository } from "../points/point.repository.js";
import { StoresService } from "../stores/store.service.js";
import { CouponsRepository } from "../coupons/coupon.repository.js";
import { CouponsService } from "../coupons/coupon.service.js";

const router = express.Router();

const ordersRepository = new OrdersRepository(prisma);
const usersRepository = new UsersRepository(prisma);
const menusRepository = new MenusRepository(prisma);
const storesRepository = new StoresRepository(prisma);
const pointsRepository = new PointsRepository(prisma);
const couponsRepository = new CouponsRepository(prisma);
const ordersService = new OrdersService(
    ordersRepository,
    usersRepository,
    menusRepository,
    storesRepository,
    orderlistRepository,
    pointsRepository,
    couponsRepository
);

const storesService = new StoresService(storesRepository);
const couponsService = new CouponsService(couponsRepository);
const ordersController = new OrdersController(ordersService, storesService, orderlistService, couponsService);
//주문 생성
router.post("/", authMiddleware, ordersController.createOrder);
//주문 확인
router.get("/:orderId", adauthMiddleware, ordersController.getOrderById);
//주문 취소
router.delete("/:orderId", authMiddleware, ordersController.deleteOrder);

export default router;
