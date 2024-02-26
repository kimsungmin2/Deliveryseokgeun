export class StoresRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    getStoreById = async (storeId) => {
        const store = await this.prisma.stores.findFirst({ where: { storeId: +storeId } });
        return store;
    };
    decrementPoint = (storeId, amount) => {
        const store = this.prisma.store.update({
            where: { storeId: +storeId },
            data: {
                storepoint: {
                    decrement: amount,
                },
            },
        });

        return store;
    };
    incrementPoint = (storeId, amount) => {
        const store = this.prisma.users.update({
            where: { storeId: +storeId },
            data: {
                storepoint: {
                    increment: amount,
                },
            },
        });

        return store;
    };
    readystatusup = async (orderId, storeId, orderStatus) => {
        const order = await this.prisma.orders.update({ where: { orderId: +orderId }, data: { storeId: +storeId, orderStatus } });
        return order;
    };
    ingstatusup = async (orderId, storeId, orderStatus) => {
        const order = await this.prisma.orders.update({ where: { orderId: +orderId }, data: { storeId: +storeId, orderStatus } });
        return order;
    };
    completestatusup = async (orderId, storeId, orderStatus) => {
        const order = await this.prisma.orders.update({ where: { orderId: +orderId }, data: { storeId: +storeId, orderStatus } });
        return order;
    };
    // deleteOrder = async (storeId, orderId) => {
    //     const order = await this.prisma.orders.
    // }
}
