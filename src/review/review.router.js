import express from "express";
import { prisma } from "../../prisma/index.js";
import { ReviewsController } from "./review.controller.js";
import { ReviewsRepository } from "./review.repository.js";
import { ReviewsService } from "./review.service.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";
import { MenusService } from "../menus/menu.service.js";
import { OrdersService } from "../orders/order.service.js";
import { MenusRepository } from "../menus/menu.repository.js";
import { OrdersRepository } from "../orders/order.repository.js";

const router = express.Router();

const reviewsRepository = new ReviewsRepository(prisma);
const menusRepository = new MenusRepository(prisma);
const ordersRepository = new OrdersRepository(prisma);

const reviewsService = new ReviewsService(reviewsRepository);
const menusService = new MenusService(menusRepository);
const ordersService = new OrdersService(ordersRepository);
const reviewsController = new ReviewsController(
  reviewsService,
  ordersService,
  menusService
);

router.post("/:menuId/reviews", authMiddleware, reviewsController.createReview);

export default router;
