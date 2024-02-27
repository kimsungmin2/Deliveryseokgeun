export class OrdersRepository {
    constructor(prisma, redisClient) {
        this.prisma = prisma;
        this.redisClient = redisClient;
    }

    findOrderedMenu = async (storeId) => {
        const orderedMenuByStoreId = await prisma.orders.findMany({
            where: {
                storeId: +storeId,
                orderStatus: {
                    in: ["cooking", "deliveryReady", "delivering"],
                },
            },
            select: {
                orderId: true,
                updatedAt: true,
            },
        });

        console.log(orderedMenuByStoreId);

        const orderedMenu = [];

        for (const order of orderedMenuByStoreId) {
            const orderDetails = await prisma.orderlist.findFirst({
                where: {
                    orderId: +order.orderId,
                },
                select: {
                    order: {
                        select: {
                            // ea: true, //데이터베이스 정보가 잘못들어가있는거 같읍니다
                            orderAddress: true,
                            orderContent: true,
                            orderStatus: true,
                            createdAt: true,
                            updatedAt: true,
                            totalPrice: true,
                            user: {
                                select: {
                                    name: true,
                                },
                            },
                            orderId: true,
                        },
                    },
                    menu: {
                        select: { menuName: true },
                    },
                },
            });
            console.log(orderDetails);
            orderedMenu.push(orderDetails);
        }

        return orderedMenu;
    };
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
        const order = await this.prisma.orders.findFirst({
            where: { orderId: +orderId },
        });
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
}
