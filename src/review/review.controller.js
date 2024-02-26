export class ReviewsController {
    reviewService = new ReviewsService();
    constructor(reviewsService) {
        this.reviewsService = reviewsService;
    }

    createReview = async (req, res, next) => {
        try {
            const { userId } = req.user;
            const { review, reviewRate } = req.body;
            const { menuId } = req.params;

            if (!review && !reviewRate) {
                return res.status(401).json({ message: "리뷰 또는 리뷰 평점을 입력해주세요." });
            }

            if (review.length < 10) {
                return res.status(400).json({ message: "리뷰는 10자 이상 작성해주십시오." });
            }

            if (isNaN(reviewRate)) {
                return res.status(400).json({ message: "평점은 숫자만 입력할 수 있습니다." });
            }

            if (reviewRate <= 0) {
                return res.status(400).json({ message: "평점 1 이상을 입력해주십시오." });
            }

            if (reviewRate > 5) {
                return res.status(400).json({ message: "평점은 5를 초과할 수 없습니다." });
            }

            //메뉴 아이디 조회해서 해당 가게 찾기
            const findStoreByMenuId = await this.reviewService.findStoreByMenuId(menuId);

            //orderId 조회 userId로 찾으면 되겠따
            const findOrderIdbyUserId = await this.reviewService.findOrderId(userId);

            const storeId = findStoreByMenuId.store.storeId;
            const orderId = findOrderIdbyUserId.orderId;

            //바디에서 받은 부분 리뷰테이블에 새로 생성
            const createReview = await this.reviewService.createReview(review, reviewRate, userId, storeId, menuId, orderId);

            return res.status(201).json({ message: "리뷰가 성공적으로 작성되었습니다." });
        } catch (err) {
            if (err instanceof NotFoundError) {
                res.status(404).json({ message: err.message });
            }
            next(err);
        }
    };
}
