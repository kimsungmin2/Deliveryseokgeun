import { jest } from "@jest/globals";
import { ReviewsService } from "./review.service.js";

// PostsRepository는 아래의 5개 메서드만 지원하고 있습니다.
let mockReviewRepository = {
  createReview: jest.fn(),
  findReview: jest.fn(),
  GetReviews: jest.fn(),
  updateReview: jest.fn(),
  deleteReview: jest.fn(),
};

// postsService의 Repository를 Mock Repository로 의존성을 주입합니다.
let reviewsService = new ReviewsService(mockReviewRepository);

describe("Reviews Service Unit Test", () => {
  // 각 test가 실행되기 전에 실행됩니다.
  beforeEach(() => {
    jest.resetAllMocks(); // 모든 Mock을 초기화합니다.
  });

  test("createReview Method", async () => {
    // findAllPosts Method를 실행했을 때, Return 값 입니다.
    const sampleReviews = {
      review: "reivew",
      reviewRate: 5,
      userId: 1,
      storeId: 3,
      menuId: 4,
      orderId: 5,
    };

    // Repository의 findAllPosts Method를 Mocking하고, samplePosts를 Return 값으로 변경합니다.
    mockReviewRepository.createReview.mockReturnValue(sampleReviews);

    // PostsService의 findAllPosts Method를 실행합니다.
    const Review = await reviewsService.createReview();

    // allPosts의 값이 postRepository의 findAllPosts Method 결과값을 내림차순으로 정렬한 것이 맞는지 검증합니다.
    expect(allPosts).toEqual(
      samplePosts.sort((a, b) => {
        return b.createdAt - a.createdAt;
      })
    );

    // PostRepository의 findAllPosts Method는 1번 호출되었는지 검증합니다.
    expect(mockReviewRepository.createReview).toHaveBeenCalledTimes(1);
  });

  //   test("findAllPosts Method", async () => {
  //     // findAllPosts Method를 실행했을 때, Return 값 입니다.
  //     const samplePosts = [
  //       {
  //         postId: 1,
  //         nickname: "Nickname_1",
  //         title: "Title_1",
  //         createdAt: new Date("06 October 2011 15:50 UTC"),
  //         updatedAt: new Date("06 October 2011 15:50 UTC"),
  //       },
  //       {
  //         postId: 2,
  //         nickname: "Nickname_2",
  //         title: "Title_2",
  //         createdAt: new Date("07 October 2011 15:50 UTC"),
  //         updatedAt: new Date("07 October 2011 15:50 UTC"),
  //       },
  //     ];

  //     // Repository의 findAllPosts Method를 Mocking하고, samplePosts를 Return 값으로 변경합니다.
  //     mockPostsRepository.findAllPosts.mockReturnValue(samplePosts);

  //     // PostsService의 findAllPosts Method를 실행합니다.
  //     const allPosts = await postsService.findAllPosts();

  //     // allPosts의 값이 postRepository의 findAllPosts Method 결과값을 내림차순으로 정렬한 것이 맞는지 검증합니다.
  //     expect(allPosts).toEqual(
  //       samplePosts.sort((a, b) => {
  //         return b.createdAt - a.createdAt;
  //       })
  //     );

  //     // PostRepository의 findAllPosts Method는 1번 호출되었는지 검증합니다.
  //     expect(mockPostsRepository.findAllPosts).toHaveBeenCalledTimes(1);
  //   });

  //   test("deletePost Method By Success", async () => {
  //     // postRepository의 findPostById Method Return 값을 설정하는 변수입니다.
  //     const samplePost = {
  //       postId: 1,
  //       nickname: "Nickname_1",
  //       title: "Title_1",
  //       content: "Content_1",
  //       password: "1234",
  //       createdAt: new Date("06 October 2011 15:50 UTC"),
  //       updatedAt: new Date("06 October 2011 15:50 UTC"),
  //     };

  //     // Mock Post Repository의 findPostById Method의 Return 값을 samplePost 변수로 변경합니다.
  //     mockPostsRepository.findPostById.mockReturnValue(samplePost);

  //     const deletePost = await postsService.deletePost(1, "1234");

  //     /** deletePost의 비즈니스 로직**/
  //     // 1. postId를 이용해 게시글을 찾고 (PostRepository.findPostById)
  //     // 2. postId, password를 이용해 게시글을 삭제한다. (PostRepository.deletePost)
  //     // 3. 해당 Method의 Return 값이 내가 원하는 형태인지 확인한다.

  //     // 1. postId를 이용해 게시글을 찾고 (PostRepository.findPostById)
  //     expect(mockPostsRepository.findPostById).toHaveBeenCalledTimes(1);
  //     expect(mockPostsRepository.findPostById).toHaveBeenCalledWith(
  //       samplePost.postId
  //     );

  //     // 2. postId, password를 이용해 게시글을 삭제한다. (PostRepository.deletePost)
  //     expect(mockPostsRepository.deletePost).toHaveBeenCalledTimes(1);
  //     expect(mockPostsRepository.deletePost).toHaveBeenCalledWith(
  //       samplePost.postId,
  //       samplePost.password
  //     );

  //     // 3. 해당 Method의 Return 값이 내가 원하는 형태인지 확인한다.
  //     expect(deletePost).toEqual({
  //       postId: samplePost.postId,
  //       nickname: samplePost.nickname,
  //       title: samplePost.title,
  //       content: samplePost.content,
  //       createdAt: samplePost.createdAt,
  //       updatedAt: samplePost.updatedAt,
  //     });
  //   });

  //   test("deletePost Method By Not Found Post Error", async () => {
  //     // findPostById Method를 실행했을 때, 아무런 게시글을 찾지 못하도록 수정합니다.
  //     const samplePost = null;

  //     // Mock Post Repository의 findPostById Method의 Return 값을 samplePost 변수(null)로 변경합니다.
  //     mockPostsRepository.findPostById.mockReturnValue(samplePost);

  //     /** deletePost의 비즈니스 로직**/
  //     // 1. postId를 이용해 게시글을 찾고 (PostRepository.findPostById)
  //     // 2. 찾은 게시글이 없을 때, Error가 발생합니다. ("존재하지 않는 게시글입니다.");

  //     try {
  //       await postsService.deletePost(8888, "1234");
  //     } catch (error) {
  //       // 1. postId를 이용해 게시글을 찾고 (PostRepository.findPostById)
  //       expect(mockPostsRepository.findPostById).toHaveBeenCalledTimes(1);
  //       expect(mockPostsRepository.findPostById).toHaveBeenCalledWith(8888);

  //       // 2. 찾은 게시글이 없을 때, Error가 발생합니다. ("존재하지 않는 게시글입니다.");
  //       expect(error.message).toEqual("존재하지 않는 게시글입니다.");
  //     }
  //   });
});
