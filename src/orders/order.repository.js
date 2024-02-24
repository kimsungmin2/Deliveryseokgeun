export class OrdersRepository {
  constructor(prisma, redisClient) {
    this.prisma = prisma;
    this.redisClient = redisClient;
  }
  createOrder = async (
    userId,
    storeId,
    menuId,
    orderstatus,
    ea,
    ordercontent
  ) => {
    const order = await this.prisma.orders.create({
      data: {
        userId: +userId,
        storeId: +storeId,
        menuId: +menuId,
        orderstatus,
        ea,
        ordercontent,
      },
    });
    return order;
  };

  searchStore = async (search) => {
    const searchStore = await prisma.stores.findMany({
      where: {
        storeName: {
          contains: search,
        },
        select: {
          storeId: true,
          storeName: true,
          storeAddress: true,
          storeCategory: true,
          rate: true,
        },
      },
    });
    return searchStore;
  };

  searchStoreByMenu = async (search) => {
    const searchByMenu = await prisma.menus.findMany({
      where: {
        menuName: {
          contains: search,
        },
      },
      select: {
        storeId: true,
      },
    });
    return searchByMenu;
  };

  searchStoreByMenuId = async (storeIdList) => {
    const searchByMenuId = await prisma.stores.findMany({
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
        rate: true,
      },
    });
    return searchByMenuId;
  };
}
