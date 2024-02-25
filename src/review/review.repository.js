import { prisma } from "../../prisma/index.js";

export class ReviewsRepository {
  //   constructor(prisma, redisClient) {
  //     this.prisma = prisma;
  //     this.redisClient = redisClient;
  //   }

  findStoreBymenuId = async (menuId) => {
    const store = await prisma.menus.findFirst({
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
    return store;
  };

  findOrderid = async (userId) => {
    const orderId = await prisma.orders.findFirst({
      where: {
        userId: +userId,
      },
      select: {
        orderId: true,
      },
    });
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
