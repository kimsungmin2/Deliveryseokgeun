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
    orderStatus,
    ea,
    orderContent
  ) => {
    const order = await this.prisma.orders.create({
      data: {
        userId: +userId,
        storeId: +storeId,
        menuId: +menuId,
        orderStatus,
        ea,
        orderContent,
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
        storeCategory: true,
        storeRate: true,
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
        storeCategory: true,
        storeRate: true,
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
}
