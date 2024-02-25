import { ReviewsRepository } from "./review.repository.js";

export class ReviewsService {
  reviewsRepository = new ReviewsRepository();

  //   constructor(servicesRepository) {
  //     this.servicesRepository = servicesRepository;
  //   }

  findStoreByMenuId = async (menuId) => {
    const store = await this.reviewsRepository.findStoreBymenuId(menuId);

    if (!store) {
      throw new NotFoundError("해당하는 가게가 존재하지 않습니다.");
    }
    return store;
  };

  findOrderId = async (userId) => {
    const orderId = await this.reviewsRepository.findOrderid(userId);
    return orderId;
  };

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
