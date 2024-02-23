export class OrdersRepository {
    constructor(prisma, redisClient) {
        this.prisma = prisma;
        this.redisClient = redisClient;
    }
    createOrder = async (userId, storeId, menuId, orderstatus, ea, ordercontent) => {
        const order = await this.prisma.orders.create({
            data: {
                userId: +userId,
                storeId: +storeId,
                menuId: +menuId,
                orderstatus,
                ea,
                ordercontent,
            },
        });
        return order;
    };
}
