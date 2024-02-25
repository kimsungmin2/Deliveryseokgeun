export class CouponsController {
    constructor(couponsService) {
        this.couponsService = couponsService;
    }

    discountCoupon = async (req, res, next) => {
        console.log(req.user);
        const { userId } = req.user;
        const {
            couponname = "3천원 할인 쿠폰(20000원 이상 주문시 사용 가능)",
            couponuse = "notuse",
            discount = "discountamount",
            couponhistory = "사용전",
        } = req.body;

        const createcoupon = await this.couponsService.discountCoupon(userId, couponname, couponuse, discount, couponhistory);
        if (!createcoupon) {
            return res.status(400).json({ message: "쿠폰 생성에 실패하였습니다" });
        }
        console.log(createcoupon);
        return res.status(201).json({ message: "쿠폰 생성에 성공하였습니다", data: createcoupon });
    };
}
