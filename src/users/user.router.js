import express from "express";
import { prisma } from "../../prisma/index.js";
import { UsersController } from "./user.controller.js";
import { UsersRepository } from "./user.repository.js";
import { UsersService } from "./user.service.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";
import { redisClient } from "../redis/client.js";
import { PointsRepository } from "../points/point.repository.js";
import { PointsService } from "../points/point.service.js";

const router = express.Router();
const usersRepository = new UsersRepository(prisma, redisClient);
const pointsRepository = new PointsRepository(prisma);
const usersService = new UsersService(usersRepository, pointsRepository);
const pointsService = new PointsService(pointsRepository);
const usersController = new UsersController(usersService, pointsService);

router.post("/signin", usersController.signIn);
router.post("/signup", usersController.userregister);
router.post("/ad/signup", usersController.adminregister);
router.patch("/sign/token", usersController.userIdedit);
router.get("/point", authMiddleware, usersController.getUserPoint);

export default router;
