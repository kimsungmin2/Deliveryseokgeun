import { ValidationError } from "../common.error.js";
import { UnauthorizedError } from "../common.error.js";
import { NotFoundError } from "../common.error.js";
import { ConflictError } from "../common.error.js";
import { ForbiddenError } from "../common.error.js";

export class ReviewsController {
    constructor(reviewsService, ordersService, menusService) {
        this.reviewsService = reviewsService;
        this.ordersService = ordersService;
        this.menusService = menusService;
    }

    createReview = async (req, res, next) => {
        try {
            const { userId } = req.user;
            const { review, reviewRate } = req.body;
            const { menuId } = req.params;

            if (!review && !reviewRate) {
                throw new UnauthorizedError("리뷰 또는 리뷰 평점을 입력해주세요.");
            }

            if (review.length < 10) {
                throw new ValidationError("리뷰는 10자 이상 작성해주십시오.");
            }

            if (isNaN(reviewRate)) {
                throw new ValidationError("평점은 숫자만 입력할 수 있습니다.");
            }

            if (reviewRate <= 0) {
                throw new ValidationError("평점 1 이상을 입력해주십시오.");
            }

            if (reviewRate > 5) {
                throw new ValidationError("평점은 5를 초과할 수 없습니다.");
            }

            //메뉴 아이디 조회해서 해당 가게 찾기
            const findStoreByMenuId = await this.menusService.findStoreByMenuId(menuId);

            console.log(findStoreByMenuId);

            //orderId 조회 userId로 찾으면 되겠따
            const findOrderIdbyUserId = await this.ordersService.getOrderById(userId);

            const storeId = findStoreByMenuId.store.storeId;
            const orderId = findOrderIdbyUserId.orderId;

            //바디에서 받은 부분 리뷰테이블에 새로 생성
            const createReview = await this.reviewsService.createReview(
                review,
                reviewRate,
                userId,
                storeId,
                menuId
                // orderId
            );

            return res.status(201).json({ message: "리뷰가 성공적으로 작성되었습니다." });
        } catch (err) {
            next(err);
        }
    };

    getReviews = async (menuId) => {
        try {
            const reviews = await this.reviewsService.findReviews(menuId);

            return res.status(200).json({ data: reviews });
        } catch (err) {
            next(err);
        }
    };

    patchReview = async (req, res, next) => {
        try {
            const { userId } = req.user;
            const { reviewId } = req.params;
            const { review, reviewRate } = req.body;

            const findreview = await this.reviewsService.findReviewById(reviewId);

            if (findreview.userId !== userId) {
                throw new ForbiddenError("작성자만 리뷰 수정이 가능합니다.");
            }

            const updateReview = await this.reviewsService.updateReview(userId, reviewId, review, reviewRate);

            return res.status(201).json({ message: "리뷰가 성공적으로 수정되었습니다." });
        } catch (err) {
            next(err);
        }
    };

    deleteReview = async (req, res, next) => {
        try {
            const { userId } = req.user;
            const { reviewId } = req.params;

            const findreview = await this.reviewsService.findReviewById(reviewId);

            if (findreview.userId !== userId) {
                throw new ForbiddenError("작성자만 리뷰 수정이 가능합니다.");
            }

            const deleteReview = await this.reviewsService.deleteReview(reviewId);

            return res.status(201).json({ message: "리뷰가 성공적으로 삭제되었습니다." });
        } catch (err) {
            next(err);
        }
    };
}
