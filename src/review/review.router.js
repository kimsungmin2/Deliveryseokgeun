import express from "express";
import { prisma } from "../../prisma/index.js";
import { ReviewsController } from "./review.controller.js";
import { ReviewsRepository } from "./review.repository.js";
import { ReviewsService } from "./review.service.js";
// import { authMiddleware } from "../middlewares/auth.middlewares.js";

const router = express.Router();

const reviewsRepository = new ReviewsRepository(prisma);

const reviewsService = new ReviewsService(reviewsRepository);

const reviewsController = new ReviewsController(reviewsService);

export default router;
