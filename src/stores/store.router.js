import express from "express";
import { prisma } from "../../prisma/index.js";
import { StoresController } from "./store.controller.js";
import { StoresRepository } from "./store.repository.js";
import { StoresService } from "./store.service.js";
import { adauthMiddleware } from "../middlewares/adauth.middlewares.js";
import { PointsRepository } from "../points/point.repository.js";
import { OrdersRepository } from "../orders/order.repository.js";

const router = express.Router();

const storesRepository = new StoresRepository(prisma);
const pointsRepository = new PointsRepository(prisma);
const ordersRepository = new OrdersRepository(prisma);
const storesService = new StoresService(storesRepository, pointsRepository, ordersRepository);

const storesController = new StoresController(storesService);

router.post("/signin", storesController.signIn);

router.patch("/:storeId/orders/:orderId/ready", adauthMiddleware, storesController.readystatusup);

router.patch("/:storeId/orders/:orderId/ing", adauthMiddleware, storesController.ingstatusup);

router.patch("/:storeId/orders/:orderId/complet", adauthMiddleware, storesController.completestatusup);

export default router;
