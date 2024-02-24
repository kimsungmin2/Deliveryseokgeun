export class OrderlistRepository {
    constructor(prisma, redisClient) {
        this.prisma = prisma;
        this.redisClient = redisClient;
    }
    createOrderlist = async (orderId, menuId) => {
        const orderlist = await this.prisma.orderlist.create({
            data: {
                orderId: +orderId,
                menuId: +menuId,
            },
        });
        return orderlist;
    };
}
