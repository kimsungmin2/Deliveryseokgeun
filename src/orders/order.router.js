import express from "express";
import { prisma } from "../../prisma/index.js";
import { OrdersController } from "./order.controller.js";
import { OrdersRepository } from "./order.repository.js";
import { OrdersService } from "./order.service.js";
import { UsersRepository } from "../users/user.repository.js";
import { MenusRepository } from "../menus/menu.repository.js";
import { StoresRepository } from "../stores/store.repository.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";
import { OrderlistRepository } from "../orderlist/orderlist.repository.js";
// import { adauthMiddleware } from "../middlewares/adauth.middlewares.js";
import { OrderlistService } from "../orderlist/orderlist.service.js";
import { PointsRepository } from "../points/point.repository.js";
import { StoresService } from "../stores/store.service.js";
import { CouponsRepository } from "../coupons/coupon.repository.js";
import { CouponsService } from "../coupons/coupon.service.js";

const router = express.Router();

const ordersRepository = new OrdersRepository(prisma);

const usersRepository = new UsersRepository(prisma);

const menusRepository = new MenusRepository(prisma);

const storesRepository = new StoresRepository(prisma);

const orderlistRepository = new OrderlistRepository(prisma);

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

const orderlistService = new OrderlistService(orderlistRepository);

const couponsService = new CouponsService(couponsRepository);

const ordersController = new OrdersController(ordersService, storesService, orderlistService, couponsService);

router.post("/", authMiddleware, ordersController.createOrder);

router.get("/:orderId", authMiddleware, ordersController.getOrderById);

router.delete("/:orderId", authMiddleware, ordersController.deleteOrder);
//음식점 검색기능
// router.post("/search", ordersController.searchData);

//카테고리 검색기능(추후 만들기)
// router.post("/store/search", async (req, res, next) => {
//   const storeCategory = req.body;
// });

//주문 배달메뉴 조회
// router.get(
//   "/:storeId/ordered",
//   // adauthMiddleware,
//   ordersController.getOrderData
// );

export default router;
