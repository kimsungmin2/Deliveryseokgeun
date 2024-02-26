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
    const makeReview = await prisma.reviews.create({
      data: {
        review: review,
        reviewRate: reviewRate,
        userId: +userId,
        storeId: +storeId,
        menuId: +menuId,
        orderId: +orderId,
      },
    });
    return makeReview;
  };
}
