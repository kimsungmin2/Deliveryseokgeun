import express from "express";
import { prisma } from "../../prisma/index.js";
import { MenusController } from "./menu.controller.js";
import { MenusRepository } from "./menu.repository.js";
import { MenusService } from "./menu.service.js";

const router = express.Router();

const menusRepository = new MenusRepository(prisma);

const menusService = new MenusService(menusRepository);

const menusController = new MenusController(menusService);

// 메뉴 정보 등록, 수정, 삭제, 조회

// 메뉴 정보 등록
router.post("/stores/:storeId", menusController.createMenu);

// 메뉴 정보 수정
router.patch("/stores/:menuId", menusController.updateMenu);

// 메뉴 정보 삭제
router.delete("/stores/:menuId", menusController.deleteMenu);

// 가게 메뉴 조회
router.get("/stores/:storeId/menu", menusController.getStoreById);

export default router;
