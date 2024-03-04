export class OrdersRepository {
    constructor(prisma, redisClient) {
        this.prisma = prisma;
        this.redisClient = redisClient;
    }
    createOrder = async (userId, storeId, orderStatus, orderContent, orderAddress, totalPrice, menuQuantity) => {
        const order = await this.prisma.$transaction(async (tx) => {
            const createdOrder = await tx.orders.create({
                data: {
                    userId: +userId,
                    storeId: +storeId,
                    orderStatus,
                    orderContent,
                    orderAddress,
                    totalPrice: +totalPrice,
                },
            });

            await Promise.all(
                menuQuantity.map(async ({ menuId, ea }) => {
                    await tx.menus.update({
                        where: { menuId: +menuId },
                        data: {
                            quantity: {
                                decrement: +ea,
                            },
                        },
                    });

                    await tx.orderlist.create({
                        data: {
                            orderId: +createdOrder.orderId,
                            menuId: +menuId,
                            ea: +ea,
                        },
                    });
                })
            );

            await tx.userpoints.create({
                data: {
                    userId: +userId,
                    possession: -totalPrice,
                    history: `주문 내역: ${storeId}에서 주문하셨습니다.)`, // 만약 ? 위에 store를 정의한다면 상점 이름으로?
                },
            });

            return createdOrder;
        });

        return order;
    };
    createCouponOrder = async (userId, storeId, orderStatus, orderContent, orderAddress, totalPrice, menuQuantity, couponId) => {
        const order = await this.prisma.$transaction(async (tx) => {
            const createdOrder = await tx.orders.create({
                data: {
                    userId: +userId,
                    storeId: +storeId,
                    orderStatus,
                    orderContent,
                    orderAddress,
                    totalPrice: +totalPrice,
                },
            });

            await Promise.all(
                menuQuantity.map(async ({ menuId, ea }) => {
                    await tx.menus.update({
                        where: { menuId: +menuId },
                        data: {
                            quantity: {
                                decrement: +ea,
                            },
                        },
                    });

                    await tx.orderlist.create({
                        data: {
                            orderId: +createdOrder.orderId,
                            menuId: +menuId,
                            ea: +ea,
                        },
                    });
                })
            );

            await tx.userpoints.create({
                data: {
                    userId: +userId,
                    possession: -totalPrice,
                    history: `주문 내역: ${storeId}에서 주문하셨습니다.)`,
                },
            });

            await tx.coupons.update({
                where: { couponId: +couponId },
                data: { couponuse: `주문 내역: ${storeId}에서 사용하셨습니다.)` },
            });

            return createdOrder;
        });

        return order;
    };

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
                            ea: true,
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

    ratingUserPoint = async (userId) => {
        const point = await this.prisma.orders.groupBy({
            by: ["userId"],
            where: { userId: +userId },
            _sum: {
                totalPrice: true,
            },
        });

        return point;
    };
}
