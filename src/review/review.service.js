import { ValidationError } from "../common.error.js";
import { UnauthorizedError } from "../common.error.js";
import { NotFoundError } from "../common.error.js";
import { ConflictError } from "../common.error.js";
import { ForbiddenError } from "../common.error.js";

export class ReviewsService {
  constructor(reviewsRepository) {
    this.reviewsRepository = reviewsRepository;
  }

  createReview = async (
    review,
    reviewRate,
    userId,
    storeId,
    menuId,
    orderId
  ) => {
    const makeReview = await this.reviewsRepository.createReview(
      review,
      reviewRate,
      userId,
      storeId,
      menuId,
      orderId
    );
    return makeReview;
  };

  findReviewById = async (reviewId) => {
    const findReivew = await this.reviewsRepository.findReview(reviewId);

    if (!findReivew) {
      throw new NotFoundError("삭제하려는 리뷰가 존재하지않습니다.");
    }

    return findReivew;
  };

  findReviews = async (menuId) => {
    const reviews = await this.reviewsRepository.GetReviews(menuId);

    if (!reviews) {
      throw new NotFoundError("리뷰가 존재하지않습니다.");
    }

    return reviews;
  };

  updateReview = async (userId, reviewId, review, reviewRate) => {
    const updateReview = await this.reviewsRepository.updateReview({
      userId,
      reviewId,
      review,
      reviewRate,
    });

    return updateReview;
  };

  deleteReview = async (reviewId) => {
    const deleteReview = await this.reviewsRepository.deleteReview(reviewId);
    return deleteReview;
  };
}
