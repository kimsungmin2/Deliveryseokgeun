export class OrdersRepository {
    constructor(prisma, redisClient) {
        this.prisma = prisma;
        this.redisClient = redisClient;
    }
    createOrder = async (userId, storeId, orderStatus, ea, orderContent, orderAddress, totalPrice) => {
        const order = await this.prisma.orders.create({
            data: {
                userId: +userId,
                storeId: +storeId,
                orderStatus,
                ea,
                orderContent,
                orderAddress,
                totalPrice: +totalPrice,
            },
        });
        return order;
    };
}
