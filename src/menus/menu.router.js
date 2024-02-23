import express from "express";
import { prisma } from "../utils/prisma/index.js";
import { MenusController } from "./menu.controller.js";
import { MenusRepository } from "./menu.repository.js";
import { MenusService } from "./menu.service.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";

const router = express.Router();

const menusRepository = new MenusRepository(prisma);

const menusService = new MenusService(menusRepository);

const menusController = new MenusController(menusService);

export default router;
