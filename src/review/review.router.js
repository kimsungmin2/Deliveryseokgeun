import express from "express";
import { prisma } from "../../prisma/index.js";
import { ReviewsController } from "./review.controller.js";
import { ReviewsRepository } from "./review.repository.js";
import { ReviewsService } from "./review.service.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";

const router = express.Router();

const reviewsRepository = new ReviewsRepository(prisma);

const reviewsService = new ReviewsService(reviewsRepository);

const reviewsController = new ReviewsController(reviewsService);

router.post("/:menuId/reviews", authMiddleware, async (req, res, next) => {
  const { userId } = req.user;
  const { review, reviewRate } = req.body;
  const { menuId } = req.params;

  if (!review && !reviewRate) {
    return res
      .status(401)
      .json({ message: "리뷰 또는 리뷰 평점을 입력해주세요." });
  }

  if (review.length < 10) {
    return res
      .status(400)
      .json({ message: "리뷰는 10자 이상 작성해주십시오." });
  }

  if (isNaN(reviewRate)) {
    return res
      .status(400)
      .json({ message: "평점은 숫자만 입력할 수 있습니다." });
  }

  if (reviewRate <= 0) {
    return res.status(400).json({ message: "평점 1 이상을 입력해주십시오." });
  }

  if (reviewRate > 5) {
    return res.status(400).json({ message: "평점은 5를 초과할 수 없습니다." });
  }

  //메뉴 아이디 조회해서 해당 가게 찾기
  const findStoreByMenuId = await prisma.menus.findFirst({
    where: { menuId: +menuId },
    select: {
      store: {
        select: {
          storeId: true,
          storeName: true,
        },
      },
    },
  });

  if (!findStoreByMenuId) {
    return res
      .status(404)
      .json({ message: "해당하는 가게가 존재하지 않습니다." });
  }

  //orderId 조회 userId로 찾으면 되겠따
  const findOrderIdbyUserId = await prisma.orders.findFirst({
    where: {
      userId: +userId,
    },
    select: {
      orderId: true,
    },
  });

  //바디에서 받은 부분 리뷰테이블에 새로 생성
  const createReview = await prisma.reviews.create({
    data: {
      review: review,
      reviewRate: reviewRate,
      userId: +userId,
      storeId: +findStoreByMenuId.store.storeId,
      menuId: +menuId,
      orderId: +findOrderIdbyUserId.orderId,
    },
  });

  return res.status(201).json({ message: "리뷰가 성공적으로 작성되었습니다." });
});

export default router;
