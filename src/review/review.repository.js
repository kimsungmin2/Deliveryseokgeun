export class ReviewsRepository {
  constructor(prisma, redisClient) {
    this.prisma = prisma;
    this.redisClient = redisClient;
  }

  //   findOrderid = async (userId) => {
  //     const orderId = await prisma.orders.findFirst({
  //       where: {
  //         userId: +userId,
  //       },
  //       select: {
  //         orderId: true,
  //       },
  //     });
  //     return orderId;
  //   };

  createReview = async (
    review,
    reviewRate,
    userId,
    storeId,
    menuId,
    orderId
  ) => {
    console.log("리뷰만들기 콘솔테스트", review);
    const makeReview = await this.prisma.reviews.create({
      data: {
        review: review,
        reviewRate: reviewRate,
        userId: +userId,
        storeId: +storeId,
        menuId: +menuId,
        orderId: +orderId,
      },
    });
    console.log("리뷰만들기 콘솔테스트", makeReview);
    return makeReview;
  };

  findReview = async (reviewId) => {
    const findReivew = await this.prisma.reviews.findFirst({
      where: {
        reviewId: +reviewId,
      },
    });
    return findReivew;
  };

  GetReviews = async (menuId) => {
    const Reviews = await this.prisma.reviews.findMany({
      where: { menuId: +menuId },
      orderBy: { createdAt: "desc" },
    });
    return Reviews;
  };

  updateReview = async (userId, reviewId, review, reviewRate) => {
    console.log("유저아이디", userId);
    console.log("리뷰", review);
    const updateReview = await this.prisma.reviews.update({
      where: {
        userId: +userId,
        reviewId: +reviewId,
      },
      data: {
        review: review,
        reviewRate: +reviewRate,
      },
    });
    return updateReview;
  };

  deleteReview = async (reviewId) => {
    const deleteReview = await this.prisma.reviews.delete({
      where: {
        reviewId: +reviewId,
      },
    });
    return deleteReview;
  };
}
