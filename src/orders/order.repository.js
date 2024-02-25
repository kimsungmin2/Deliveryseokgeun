import { prisma } from "../../prisma/index.js";

export class OrdersRepository {
  //   constructor(prisma, redisClient) {
  //     this.prisma = prisma;
  //     this.redisClient = redisClient;
  //   }
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
      },
      select: {
        storeId: true,
        storeName: true,
        storeAddress: true,
        // storeCategory: true,
        // rate: true,
      },
    });
    console.log(searchStore);
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
        // storeCategory: true,
        // rate: true,
      },
    });
    return searchByMenuId;
  };

  findStoreById = async (storeId) => {
    const findStore = prisma.stores.findFirst({
      where: {
        storeId: +storeId,
      },
    });
    return findStore;
  };

  findOrderedMenu = async (storeId) => {
    console.log(storeId);
    const orderedMenu = await prisma.orders.findMany({
      where: {
        storeId: +storeId,
        orderStatus: {
          in: ["cooking", "deliveryready", "delivering"],
        },
      },
      select: {
        //이중 select 이렇게 쓰면 되는지?..
        user: {
          select: {
            name: true,
          },
        },
        orderlist: {
          select: {
            menu: {
              select: {
                menuName: true,
              },
            },
            ea: true,
          },
        },
        orderAddress: true,
        totalPrice: true,
        orderContent: true,
        orderStatus: true,
        createdAt: true,
      },
    });
    return orderedMenu;
  };
}
