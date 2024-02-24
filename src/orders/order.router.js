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
import { adauthMiddleware } from "../middlewares/adauth.middlewares.js";
import { OrderlistService } from "../orderlist/orderlist.service.js";

const router = express.Router();

const ordersRepository = new OrdersRepository(prisma);
const usersRepository = new UsersRepository(prisma);
const menusRepository = new MenusRepository(prisma);
const storesRepository = new StoresRepository(prisma);
const orderlistRepository = new OrderlistRepository(prisma);
const ordersService = new OrdersService(ordersRepository, usersRepository, menusRepository, storesRepository, orderlistRepository);
const orderlistService = new OrderlistService(orderlistRepository);
const ordersController = new OrdersController(ordersService, orderlistService);

router.post("/", authMiddleware, ordersController.createOrder);

router.patch("/:orderId", authMiddleware, ordersController.userupdateOrder);

router.patch("/deliveryready/:orderId", adauthMiddleware, ordersController.drstatusup);

export default router;
