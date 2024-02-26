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

router.post("/discount", authMiddleware, couponsController.discountCoupon);

router.post("/percentage", authMiddleware, couponsController.percentageCoupon);

export default router;
