export class CouponsController {
    constructor(couponsService) {
        this.couponsService = couponsService;
    }

    discountCoupon = async (req, res, next) => {
        const { userId } = req.user;
        const {
            couponname = "3천원 할인 쿠폰(20000원 이상 주문시 사용 가능)",
            couponuse = "notuse",
            discount = "discountamount",
            couponhistory = "사용전",
            amount = 3000,
            certainamount = 20000,
        } = req.body;

        const createcoupon = await this.couponsService.discountCoupon(userId, couponname, couponuse, discount, couponhistory, amount, certainamount);
        if (!createcoupon) {
            return res.status(400).json({ message: "쿠폰 생성에 실패하였습니다" });
        }
        console.log(createcoupon);
        return res.status(201).json({ message: "쿠폰 생성에 성공하였습니다", data: createcoupon });
    };
    percentageCoupon = async (req, res, next) => {
        const { userId } = req.user;
        const {
            couponname = "20% 할인 쿠폰(50000원 이상 주문시 사용 가능)",
            couponuse = "notuse",
            discount = "percentage",
            couponhistory = "사용전",
            amount = 20,
            certainamount = 50000,
        } = req.body;

        const createcoupon = await this.couponsService.percentageCoupon(
            userId,
            couponname,
            couponuse,
            discount,
            couponhistory,
            amount,
            certainamount
        );
        if (!createcoupon) {
            return res.status(400).json({ message: "쿠폰 생성에 실패하였습니다" });
        }
        console.log(createcoupon);
        return res.status(201).json({ message: "쿠폰 생성에 성공하였습니다", data: createcoupon });
    };
    randomCoupon = async (req, res, next) => {
        const { userId } = req.user;
        const randomNumber = Math.random();
        let random;
        if (randomNumber < 0.1) {
            random = await this.couponsService.randomCoupon(userId);
        } else {
            random = "꽝";
        }
        return res.status(200).json({ data: random });
    };
    blackCoupon = async (req, res, next) => {
        const { userId } = req.user;

        const today = new Date().getDay();
        console.log(today);
        if (today === 5) {
            await this.couponsService.blackCoupon(userId);
        } else {
            return res.status(201).json({ message: "금요일이이 아닙니다" });
        }

        return res.status(201).json({ message: "블랙 프라이데이 쿠폰 발급이 완료되었습니다." });
    };
}
