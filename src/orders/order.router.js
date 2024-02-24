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

const router = express.Router();

const ordersRepository = new OrdersRepository(prisma);
const usersRepository = new UsersRepository(prisma);
const menusRepository = new MenusRepository(prisma);
const storesRepository = new StoresRepository(prisma);
const orderlistRepository = new OrderlistRepository(prisma);
const ordersService = new OrdersService(ordersRepository, usersRepository, menusRepository, storesRepository, orderlistRepository);

const ordersController = new OrdersController(ordersService);

router.post("/", authMiddleware, ordersController.createOrder);

export default router;
