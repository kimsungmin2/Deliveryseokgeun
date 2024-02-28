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
import { OrdersRepository } from "../orders/order.repository.js";
import { CouponsRepository } from "../coupons/coupon.repository.js";

const router = express.Router();
const usersRepository = new UsersRepository(prisma, redisClient);
const ordersRepository = new OrdersRepository(prisma);
const pointsRepository = new PointsRepository(prisma);

const couponsRepository = new CouponsRepository(prisma);
const usersService = new UsersService(usersRepository, pointsRepository, ordersRepository, couponsRepository);

const pointsService = new PointsService(pointsRepository);
const usersController = new UsersController(usersService, pointsService);
//로그인
router.post("/signin", usersController.signIn);
router.post("/adsignin", usersController.adsignIn);
//회원가입
router.post("/userregistr", usersController.userregister);
router.post("/adusers", usersController.adminregister);
//메일 인증
router.patch("/userregistr", usersController.useraceess);
router.patch("/adusers/ad", usersController.aduseraceess);
//유저 조회
router.get("/point", authMiddleware, usersController.getUserPoint);
router.get("/:userId", usersController.getUser);
router.get("/", usersController.getUsermany);
router.get("/adusers/list", usersController.getadmin);
router.get("/adusers/:aduserId", usersController.getadUser);

//유저 정보 수정
router.patch("/:userId", authMiddleware, usersController.userEdit);
router.patch("/adusers/:aduserId", adauthMiddleware, usersController.aduserEdit);
//유저 삭제
router.delete("/:userId", authMiddleware, usersController.userdelete);
router.delete("/adusers/:aduserId", adauthMiddleware, usersController.aduserdelete);

router.post("/adsignup", usersController.adsignIn);

export default router;
