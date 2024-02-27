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
const storesService = new StoresService(
  storesRepository,
  pointsRepository,
  ordersRepository
);

const storesController = new StoresController(storesService);

router.post("/", adauthMiddleware, storesController.createStoreInfo);

router.get("/:storeId", storesController.getStoreById);

router.get("/", storesController.getStoreList);

router.patch("/:storeId", adauthMiddleware, storesController.updateStoreInfo);

router.delete("/:storeId", adauthMiddleware, storesController.deleteStoreInfo);

router.patch(
  "/orders/:orderId/ready",
  adauthMiddleware,
  storesController.readystatusup
);

router.patch(
  "/orders/:orderId/ing",
  adauthMiddleware,
  storesController.ingstatusup
);

router.patch(
  "/orders/:orderId/complet",
  adauthMiddleware,
  storesController.completestatusup
);

router.delete(
  "/:storeId/orders/:orderId",
  adauthMiddleware,
  storesController.deleteOrder
);

export default router;
