import express from "express";
import { prisma } from "../../prisma/index.js";
import { StoresController } from "./store.controller.js";
import { StoresRepository } from "./store.repository.js";
import { StoresService } from "./store.service.js";
import { adauthMiddleware } from "../middlewares/adauth.middlewares.js";
import { PointsRepository } from "../points/point.repository.js";
import { OrdersRepository } from "../orders/order.repository.js";
import { MenusRepository } from "../menus/menu.repository.js";

const router = express.Router();

const storesRepository = new StoresRepository(prisma);
const pointsRepository = new PointsRepository(prisma);
const ordersRepository = new OrdersRepository(prisma);
const menusRepository = new MenusRepository(prisma);
const storesService = new StoresService(storesRepository, pointsRepository, ordersRepository, menusRepository);

const storesController = new StoresController(storesService);

//가게 정보 등록
router.post("/", adauthMiddleware, storesController.createStoreInfo);
//가게 조회
router.get("/:storeId", storesController.getStoreById);
router.get("/", storesController.getStoreList);
//가게 수정
router.patch("/:storeId", adauthMiddleware, storesController.updateStoreInfo);
//가게 삭제
router.delete("/:storeId", adauthMiddleware, storesController.deleteStoreInfo);
//배달 변경
router.patch("/orders/:orderId/ready", adauthMiddleware, storesController.readystatusup);
router.patch("/orders/:orderId/ing", adauthMiddleware, storesController.ingstatusup);
router.patch("/orders/:orderId/complet", adauthMiddleware, storesController.completestatusup);
//주문 취소
router.delete("/:storeId/orders/:orderId", adauthMiddleware, storesController.deleteOrder);
//키워드 검색
router.post("/search", storesController.searchData);
//배달 조회
router.get("/:storeId/ordered", adauthMiddleware, storesController.getOrderData);

export default router;
