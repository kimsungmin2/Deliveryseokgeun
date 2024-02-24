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
    transaction = async (operations) => {
        return this.prisma.$transaction(operations);
    };

    getOrderById = async (orderId) => {
        const order = await this.prisma.orders.findFirst({ where: { orderId: +orderId } });
        return order;
    };

    userupdateOrder = async (orderId, userId, ea, orderContent, orderAddress, totalPrice) => {
        const order = await this.prisma.orders.update({
            where: { orderId: +orderId },
            data: {
                userId: +userId,
                ea,
                orderContent,
                orderAddress,
                totalPrice: +totalPrice,
            },
        });
        return order;
    };
    drstatusup = async (orderId, orderStatus) => {
        const order = await this.prisma.orders.update({ where: { orderId: +orderId }, data: { orderStatus } });
    };
}
