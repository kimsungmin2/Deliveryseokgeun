export class StoresRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    getStoreById = async (storeId) => {
        const store = await this.prisma.stores.findFirst({ where: { storeId } });
        return store;
    };
}
