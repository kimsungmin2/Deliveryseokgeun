export class CouponsService {
    constructor(couponsRepository) {
        this.couponsRepository = couponsRepository;
    }
    discountCoupon = async (userId, couponname, couponuse, discount, couponhistory, amount, certainamount) => {
        const coupon = await this.couponsRepository.discountCoupon(userId, couponname, couponuse, discount, couponhistory, amount, certainamount);

        return coupon;
    };
    percentageCoupon = async (userId, couponname, couponuse, discount, couponhistory, amount, certainamount) => {
        const coupon = await this.couponsRepository.percentageCoupon(userId, couponname, couponuse, discount, couponhistory, amount, certainamount);

        return coupon;
    };
    getCouponId = async (couponId) => {
        const coupon = await this.couponsRepository.getCouponId(couponId);
        if (!coupon) throw new Error("존재하지 않는 쿠폰입니다.");
        return coupon;
    };
    updateCoupon = async (couponId, couponuse, couponhistory) => {
        const coupon = await this.couponsRepository.updateCoupon(couponId, couponuse, couponhistory);
        return coupon;
    };
    randomCoupon = async (userId) => {
        const couponname = "3%랜덤 쿠폰";
        const couponuse = "notuse";
        const discount = "percentage";
        const couponhistory = "이벤트 쿠폰";
        const amount = 70;
        const certainamount = 25000;
        const random = await this.couponsRepository.percentageCoupon(userId, couponname, couponuse, discount, couponhistory, amount, certainamount);
        return random;
    };
}
