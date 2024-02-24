export class StoresRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    getStoreById = async (storeId) => {
        const store = await this.prisma.stores.findFirst({ where: { storeId } });
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
}
