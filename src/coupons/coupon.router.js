import express from "express";
import { prisma } from "../../prisma/index.js";
import { CouponsController } from "./coupon.controller.js";
import { CouponsRepository } from "./coupon.repository.js";
import { CouponsService } from "./coupon.service.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";

const router = express.Router();

const couponsRepository = new CouponsRepository(prisma);

const couponsService = new CouponsService(couponsRepository);

const couponsController = new CouponsController(couponsService);
//쿠폰 생성
router.post("/discount", authMiddleware, couponsController.discountCoupon);
router.post("/percentage", authMiddleware, couponsController.percentageCoupon);
//랜덤 쿠폰 생성
router.post("/random", authMiddleware, couponsController.randomCoupon);
//금요일에만 발급되는 쿠폰 생성
router.post("/black", authMiddleware, couponsController.blackCoupon);
export default router;
