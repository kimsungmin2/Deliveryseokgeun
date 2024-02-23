import express from "express";
import { prisma } from "../../prisma/index.js";
import { UsersController } from "./user.controller.js";
import { UsersRepository } from "./user.repository.js";
import { UsersService } from "./user.service.js";
// import { authMiddleware } from "../middlewares/auth.middlewares.js";
import { redisClient } from "../redis/client.js";

const router = express.Router();
const usersRepository = new UsersRepository(prisma, redisClient);

const usersService = new UsersService(usersRepository);

const usersController = new UsersController(usersService);

router.post("/signin", usersController.signIn);

export default router;
