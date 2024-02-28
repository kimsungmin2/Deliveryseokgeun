import express from "express";
import { prisma } from "../../prisma/index.js";
import { UsersController } from "./user.controller.js";
import { UsersRepository } from "./user.repository.js";
import { UsersService } from "./user.service.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";
import { redisClient } from "../redis/client.js";
import { PointsRepository } from "../points/point.repository.js";
import { PointsService } from "../points/point.service.js";
import { adauthMiddleware } from "../middlewares/adauth.middlewares.js";


const router = express.Router();
const usersRepository = new UsersRepository(prisma, redisClient);
const pointsRepository = new PointsRepository(prisma);
const usersService = new UsersService(usersRepository, pointsRepository);
const pointsService = new PointsService(pointsRepository);
const usersController = new UsersController(usersService, pointsService);


router.post("/signin", usersController.signIn);
router.post("/adsignin", usersController.adsignIn);

router.post("/userregistr", usersController.userregister);
router.post("/adusers", usersController.adminregister);

router.get("/point", authMiddleware, usersController.getUserPoint);

router.patch("/:userId", authMiddleware, usersController.userEdit);
router.patch("/adusers/:aduserId", adauthMiddleware, usersController.aduserEdit);

router.get("/:userId", usersController.getUser);
router.get("/", usersController.getUsermany);

router.get("/:aduserId", usersController.getadUser);
router.get("/adusers", usersController.getadUsermany);


router.patch("/useraceess", usersController.useraceess);
router.patch("/aduseraceess", usersController.aduseraceess);


router.delete("/:userId", authMiddleware, usersController.userdelete);
router.delete("/adusers/:aduserId", adauthMiddleware, usersController.aduserdelete);




export default router;
