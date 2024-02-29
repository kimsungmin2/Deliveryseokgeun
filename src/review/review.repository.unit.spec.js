import { jest } from "@jest/globals";
import { ReviewsRepository } from "./review.repository.js";

// Prisma 클라이언트에서는 아래 5개의 메서드만 사용합니다.
let mockPrisma = {
  reviews: {
    create: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

let reviewsRepository = new ReviewsRepository(mockPrisma);

describe("Review Repository Unit Test", () => {
  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
  });

  test("findManyReview Method", async () => {
    // findMany Mock의 Return 값을 "findMany String"으로 설정합니다.
    const mockReturn = "findMany String";
    mockPrisma.reviews.findMany.mockReturnValue(mockReturn);

    // postsRepository의 findAllPosts Method를 호출합니다.
    const reviews = await reviewsRepository.GetReviews();

    // prisma.posts의 findMany은 1번만 호출 되었습니다.
    expect(mockPrisma.reviews.findMany).toHaveBeenCalledTimes(1);
    //findMany가 여러개 있으면 안되나여
    //expect 안의 findMany가 repository의 findMany가 맞는지???★★★★

    // mockPrisma의 Return과 출력된 findMany Method의 값이 일치하는지 비교합니다.★★★★
    expect(reviews).toBe(mockReturn);
  });

  test("findFirstReview Method", async () => {
    const mockReturn = "findFirst String";
    mockPrisma.reviews.findFirst.mockReturnValue(mockReturn);

    // postsRepository의 findAllPosts Method를 호출합니다.
    const reviews = await reviewsRepository.findReview();

    // prisma.posts의 findMany은 1번만 호출 되었습니다.
    expect(mockPrisma.reviews.findFirst).toHaveBeenCalledTimes(1);
    //findMany가 여러개 있으면 안되나여
    //expect 안의 findMany가 repository의 findMany가 맞는지???★★★★

    // mockPrisma의 Return과 출력된 findMany Method의 값이 일치하는지 비교합니다.★★★★
    expect(reviews).toBe(mockReturn);
  });

  test("createReviews Method", async () => {
    // create Mock의 Return 값을 "create Return String"으로 설정합니다.
    const mockReturn = "create Return String";
    mockPrisma.reviews.create.mockReturnValue(mockReturn);

    // createPost Method를 실행하기 위해 필요한 Params 입니다.
    const createReviewParams = {
      review: "createPostNickname",
      reviewRate: "createPostPassword",
      userId: 11,
      storeId: 11,
      menuId: 11,
      orderId: 11,
    };

    // postsRepository의 createPost Method를 실행합니다.
    const createReivewData = await reviewsRepository.createReview(
      createReviewParams.review,
      createReviewParams.reviewRate,
      createReviewParams.userId,
      createReviewParams.storeId,
      createReviewParams.menuId,
      createReviewParams.orderId
    );

    // createPostData는 prisma.posts의 create를 실행한 결과값을 바로 반환한 값인지 테스트합니다.
    expect(createReivewData).toBe(mockReturn);

    // postsRepository의 createPost Method를 실행했을 때, prisma.posts의 create를 1번 실행합니다.
    expect(mockPrisma.reviews.create).toHaveBeenCalledTimes(1);

    // postsRepository의 createPost Method를 실행했을 때, prisma.posts의 create를 아래와 같은 값으로 호출합니다.
    expect(mockPrisma.reviews.create).toHaveBeenCalledWith({
      data: createReviewParams,
    });
  });

  test("updateReviews Method", async () => {
    // create Mock의 Return 값을 "create Return String"으로 설정합니다.
    const mockReturn = "update Return String";
    mockPrisma.reviews.update.mockReturnValue(mockReturn);

    // 가상으로 줄 값들
    const updateReviewParams = {
      userId: {
        userId: 4,
        reviewId: 4,
        review: "Updated Review Content",
        reviewRate: 4,
      },
    };
    console.log(updateReviewParams);
    // postsRepository의 createPost Method를 실행합니다.
    const createReivewData = await reviewsRepository.updateReview(
      updateReviewParams.userId.userId,
      updateReviewParams.userId.reviewId,
      updateReviewParams.userId.review,
      updateReviewParams.userId.reviewRate
    );

    // createPostData는 prisma.posts의 create를 실행한 결과값을 바로 반환한 값인지 테스트합니다.
    expect(createReivewData).toBe(mockReturn);

    // postsRepository의 createPost Method를 실행했을 때, prisma.posts의 create를 1번 실행합니다.
    expect(mockPrisma.reviews.update).toHaveBeenCalledTimes(1);

    // postsRepository의 createPost Method를 실행했을 때, prisma.posts의 create를 아래와 같은 값으로 호출합니다.
    expect(mockPrisma.reviews.update).toHaveBeenCalledWith({
      where: {
        userId: +updateReviewParams.userId.userId,
        reviewId: +updateReviewParams.userId.reviewId,
      },
      data: {
        review: updateReviewParams.userId.review,
        reviewRate: +updateReviewParams.userId.reviewRate,
      },
    });
  });
});
