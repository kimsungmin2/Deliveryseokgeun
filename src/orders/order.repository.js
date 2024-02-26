export class OrdersRepository {
    constructor(prisma, redisClient) {
        this.prisma = prisma;
        this.redisClient = redisClient;
    }
    createOrder = async (userId, storeId, orderStatus, orderContent, orderAddress, totalPrice) => {
        const order = await this.prisma.orders.create({
            data: {
                userId: +userId,
                storeId: +storeId,
                orderStatus,
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
    deleteOrder = async (orderId, userId) => {
        const deletedOrder = await this.prisma.orders.delete({
            where: {
                orderId: +orderId,
                userId: +userId,
            },
        });
        return deletedOrder;
    };
    deleteOrder = async (orderId, storeId) => {
        const deletedOrder = await this.prisma.orders.delete({
            where: {
                orderId: +orderId,
                storeId: +storeId,
            },
        });
        return deletedOrder;
    };
}
