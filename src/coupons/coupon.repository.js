export class CouponsRepository {
    constructor(prisma, redisClient) {
        this.prisma = prisma;
        this.redisClient = redisClient;
    }
    discountCoupon = async (userId, couponname, couponuse, discount, couponhistory) => {
        const coupon = await this.prisma.coupons.create({
            data: {
                userId: +userId,
                couponname,
                couponuse,
                discount,
                couponhistory,
            },
        });
        return coupon;
    };
    getCouponById = async (couponId) => {
        const coupon = await this.prisma.menus.findFirst({
            where: { couponId: +couponId },
        });
        return coupon;
    };
}
