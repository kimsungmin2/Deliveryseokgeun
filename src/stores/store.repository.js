export class StoresRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    getStoreByEmail = async (adEmail) => {
        const store = await this.prisma.aduser.findFirst({ where: { adEmail } });
        return store;
    };
    createStoreInfo = async (aduserId, storeName, storeAddress, storeContact, storeContent, storeCategory) => {
        const storeInfo = await this.prisma.stores.create({
            data: {
                aduserId: +aduserId,
                storeName,
                storeAddress,
                storeContact,
                storeContent,
                storeCategory,
            },
        });
        return storeInfo;
    };

    getStoreById = async (storeId) => {
        const store = await this.prisma.stores.findFirst({
            where: { storeId: +storeId },
        });
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
        const order = await this.prisma.orders.update({
            where: { orderId: +orderId },
            data: { storeId: +storeId, orderStatus },
        });
        return order;
    };
    ingstatusup = async (orderId, storeId, orderStatus) => {
        const order = await this.prisma.orders.update({
            where: { orderId: +orderId },
            data: { storeId: +storeId, orderStatus },
        });
        return order;
    };
    completestatusup = async (orderId, storeId, orderStatus) => {
        const order = await this.prisma.orders.update({
            where: { orderId: +orderId },
            data: { storeId: +storeId, orderStatus },
        });
        return order;
    };
    // 가게 목록 조회
    getStoreList = async () => {
        const storeList = await this.prisma.stores.findMany({
            select: {
                storeId: true,
                storeName: true,
                storeAddress: true,
                storeContact: true,
                storeCategory: true,
                storeRate: true,
            },
        });
        return storeList;
    };
    // 가게 정보 수정
    updateStoreInfo = async (storeId, userId, storeName, storeAddress, storeContact, storeContent, storeCategory) => {
        // const store = await this.prisma.stores.findFirst({
        //   where: {
        //     storeId: +storeId,
        //   },
        // });

        const store = await this.prisma.stores.update({
            where: {
                storeId: +storeId,
            },
            data: {
                userId,
                storeName,
                storeAddress,
                storeContact,
                storeContent,
                storeCategory,
            },
        });
        return store;
    };
    // 가게 정보 삭제
    deleteStoreInfo = async (storeId, aduserId) => {
        // const store = await this.prisma.stores.findFirst({
        //   where: {
        //     storeId: +deleteStoreId,
        //   },
        // });
        // if (store.storeId !== deleteStoreId) {
        //   throw new Error("삭제 하려는 가게 정보가 없습니다.");
        // }

        const store = await this.prisma.stores.delete({
            where: {
                storeId: +storeId,
                aduserId: +aduserId,
            },
        });

        return store;
    };
    searchStoreByMenuId = async (storeIdList) => {
        const searchByMenuId = await this.prisma.stores.findMany({
            where: {
                storeId: {
                    in: storeIdList,
                },
            },
            select: {
                storeId: true,
                storeName: true,
                storeAddress: true,
                storeCategory: true,
                storeRate: true,
            },
        });
        return searchByMenuId;
    };
    searchStore = async (search) => {
        const searchStore = await this.prisma.stores.findMany({
            where: {
                storeName: {
                    contains: search,
                },
            },
            select: {
                storeId: true,
                storeName: true,
                storeAddress: true,
                storeCategory: true,
                storeRate: true,
            },
        });
        console.log(searchStore);
        return searchStore;
    };
}
