import express from "express";
import { prisma } from "../../prisma/index.js";
import { UsersController } from "./user.controller.js";
import { UsersRepository } from "./user.repository.js";
import { UsersService } from "./user.service.js";
import { redisClient } from "../redis/client.js";


const router = express.Router();
const usersRepository = new UsersRepository(prisma, redisClient);

const usersService = new UsersService(usersRepository);

const usersController = new UsersController(usersService);


router.post("/signin", usersController.signIn);
router.post("/userregistr", usersController.userregister);
router.post("/adusers", usersController.adminregister);
router.patch("/idedit", usersController.userIdedit);


export default router;
