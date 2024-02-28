import express from "express";
import { prisma } from "../../prisma/index.js";
import { ReviewsController } from "./review.controller.js";
import { ReviewsRepository } from "./review.repository.js";
import { ReviewsService } from "./review.service.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";
import { StoresService } from "../stores/store.service.js";
import { MenusService } from "../menus/menu.service.js";
import { OrdersService } from "../orders/order.service.js";
import { MenusRepository } from "../menus/menu.repository.js";
import { OrdersRepository } from "../orders/order.repository.js";
import { StoresRepository } from "../stores/store.repository.js";

const router = express.Router();

const reviewsRepository = new ReviewsRepository(prisma);
const menusRepository = new MenusRepository(prisma);
const ordersRepository = new OrdersRepository(prisma);
const storesRepository = new StoresRepository(prisma);

const storeService = new StoresService(storesRepository);
const reviewsService = new ReviewsService(reviewsRepository);
const menusService = new MenusService(menusRepository);
const ordersService = new OrdersService(ordersRepository);
const reviewsController = new ReviewsController(reviewsService, ordersService, menusService, storeService);
//리뷰 생성
router.post("/:menuId/reviews", authMiddleware, reviewsController.createReview);
//메뉴 리뷰조회
router.get("/:menuId", reviewsController.getReviews);
//리뷰삭제
router.delete("/:reviewId/reviews", authMiddleware, reviewsController.deleteReview);
//리뷰수정
router.patch("/:reviewId/reviews", authMiddleware, reviewsController.patchReview);
export default router;
