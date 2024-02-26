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
}
