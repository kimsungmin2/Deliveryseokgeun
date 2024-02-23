export class StoresRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    getStoreByEmail = async (storeEmail) => {
        const store = await this.prisma.stores.findFirst({ where: { storeEmail } });
        return store;
    };
}
