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
    updateResume = async (resumeId, title, content, status) => {
        const updatedResume = await this.prisma.resumes.update({
            where: { resumeId: +resumeId },
            data: { title, content, status },
        });

        return updatedResume;
    };
}
