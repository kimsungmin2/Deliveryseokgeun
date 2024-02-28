import express from "express";
import { prisma } from "../../prisma/index.js";
import { MenusController } from "./menu.controller.js";
import { MenusRepository } from "./menu.repository.js";
import { MenusService } from "./menu.service.js";
import { adauthMiddleware } from "../middlewares/adauth.middlewares.js";
import { StoresService } from "../stores/store.service.js";
import { StoresRepository } from "../stores/store.repository.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

const menusRepository = new MenusRepository(prisma);
const storesRepository = new StoresRepository(prisma);
const menusService = new MenusService(menusRepository, storesRepository);
const storesService = new StoresService(storesRepository);
const menusController = new MenusController(menusService, storesService);

// 메뉴 정보 등록, 수정, 삭제, 조회

// 메뉴 정보 등록
router.post("/stores/:storeId", upload, adauthMiddleware, menusController.createMenu);

// 메뉴 정보 수정
router.patch("/:storeId/menu/:menuId", adauthMiddleware, menusController.updateMenu);

// 메뉴 정보 삭제
router.delete("/:storeId/menu/:menuId", adauthMiddleware, menusController.deleteMenu);

// 가게 메뉴 조회
router.get("/stores/:storeId/menu", adauthMiddleware, menusController.getStoreById);

export default router;
