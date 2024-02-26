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

export default router;
