import express from "express";
import { prisma } from "../../prisma/index.js";
import { StoresController } from "./store.controller.js";
import { StoresRepository } from "./store.repository.js";
import { StoresService } from "./store.service.js";
import { adminMiddleware } from "../middlewares/admin.middlewares.js";
// import { authMiddleware } from "../middlewares/auth.middlewares.js";

const router = express.Router();

const storesRepository = new StoresRepository(prisma);

const storesService = new StoresService(storesRepository);

const storesController = new StoresController(storesService);

router.post("/signin", storesController.signIn);

router.post('/', adminMiddleware, storesController.createStoreInfo)

router.get('/:storeId', storesController.getStoreInfo)

router.get('/', storesController.getStoreList)

router.patch('/:storeId', adminMiddleware, storesController.updateStoreInfo)

router.delete('/:storeId', adminMiddleware, storesController.deleteStoreInfo)

export default router;