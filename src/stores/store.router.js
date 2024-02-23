import express from "express";
import { prisma } from "../utils/prisma/index.js";
import { StoresController } from "./store.controller.js";
import { StoresRepository } from "./store.repository.js";
import { StoresService } from "./store.service.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";

const router = express.Router();

const storesRepository = new StoresRepository(prisma);

const storesService = new StoresService(storesRepository);

const storesController = new StoresController(storesService);

export default router;
