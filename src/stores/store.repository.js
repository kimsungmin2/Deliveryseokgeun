export class StoresRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
  getStoreByEmail = async (adEmail) => {
    const store = await this.prisma.aduser.findFirst({ where: { adEmail } });
    return store;
  };

  createStoreInfo = async (
    storeName,
    storeAddress,
    storeContact,
    storeContent,
    aduserId
  ) => {
    const storeInfo = await this.prisma.stores.create({
      data: {
        aduserId: +aduserId,
        storeName,
        storeAddress,
        storeContact,
        storeContent,
      },
    });
    return storeInfo;
  };

  getStoreInfo = async (storeId) => {
    const detailStoreInfo = await this.prisma.stores.findFirst({
      where: {
        storeId: +storeId,
      },
      select: {
        storeId: true,
        storeName: true,
        storeAddress: true,
        storeContact: true,
        storeContent: true,
        reviews: {
          select: {
            rate: true,
          },
        },
      },
    });
    return detailStoreInfo;
  };

  getStoreList = async () => {
    const storeList = await this.prisma.stores.findMany({
      select: {
        storeId: true,
        storeName: true,
        storeAddress: true,
        storeContact: true,
        reviews: {
          select: {
            rate: true,
          },
        },
      },
    });
    return storeList;
  };

  updateStoreInfo = async (
    storeName,
    storeAddress,
    storeContact,
    storeContent,
    storeId
  ) => {
    const store = await this.prisma.stores.findFirst({
      where: {
        storeId: +storeId,
      },
    });
    await this.prisma.stores.update({
      where: {
        storeId: +storeId,
      },
      data: {
        storeName,
        storeAddress,
        storeContact,
        storeContent,
      },
    });
    return store;
  };

  deleteStoreInfo = async (storeId, aduserId) => {
    const store = await this.prisma.stores.delete({
        where: {
            storeId: +storeId,
            aduserId: +aduserId,
        },
    });
    return store;
};
}
