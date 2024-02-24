export class OrderlistRepository {
    constructor(prisma, redisClient) {
        this.prisma = prisma;
        this.redisClient = redisClient;
    }
    createOrderlist = (orderId, menuId) => {
        const orderlist = this.prisma.orderlist.create({
            data: {
                orderId: +orderId,
                menuId: +menuId,
            },
        });
        return orderlist;
    };

    getOrderlistById = async (orderlistId) => {
        const orderlist = await this.prisma.orderlist.findFirst({ where: { orderlistId: +orderlistId } });
        return orderlist;
    };
    updateOrderlist = async (orderlistId, menuId) => {
        const updatedOrder = await this.prisma.orderlist.update({
            where: { orderlistId: +orderlistId },
            data: { menuId: +menuId },
        });
        return updatedOrder;
    };
}
