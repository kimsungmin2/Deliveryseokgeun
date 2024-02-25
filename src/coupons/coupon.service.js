export class CouponsService {
    constructor(couponsRepository) {
        this.couponsRepository = couponsRepository;
    }
    discountCoupon = async (userId, couponname, couponuse, discount, couponhistory) => {
        const coupon = await this.couponsRepository.discountCoupon(userId, couponname, couponuse, discount, couponhistory);
        console.log(userId);
        return coupon;
    };
    getCouponById = async (couponId) => {
        const coupon = await this.couponsRepository.getCouponById(couponId);
        if (!coupon) throw new Error("존재하지 않는 쿠폰입니다.");
        return coupon;
    };
}
