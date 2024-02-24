import { OrdersRepository } from "./order.repository.js";

export class OrdersService {
  menuRepository = new OrdersRepository();

  // constructor(ordersRepository) {
  //   this.ordersRepository = ordersRepository;
  // }

  createOrder = async (
    userId,
    storeId,
    menuId,
    orderstatus,
    ea,
    ordercontent
  ) => {
    const menu = await this.menuRepository.getMenuById(menuId);

    const totalPrice = menu.price * ea;

    const user = await this.userRepository.getUserById(userId);

    if (user.userpoint < totalPrice) {
      throw new Error("잔액이 부족합닌다");
    }

    const order = await this.ordersRepository.createOrder(
      userId,
      storeId,
      menuId,
      orderstatus,
      ea,
      ordercontent,
      totalPrice
    );

    await this.userRepository.decrementPoint(userId, totalPrice);

    return order;
  };

  //검색키워드를 storeName에 포함한 가게들의 정보
  findStore = async (search) => {
    const searchStore = await this.ordersRepository.searchStore(search);

    //검색키워드를 포함한 메뉴를 가진 storeId 호출
    const searchMenu = await this.ordersRepository.searchStoreByMenu(search);

    const storeIdList = searchMenu.map((menu) => +menu.storeId);

    //검색키워드를 포함한 메뉴를 가진 store의 정보들
    const searchStore2 =
      await this.ordersRepository.searchStoreByMenuId(storeIdList);

    if (!searchStore && !searchStore2) {
      throw { code: 404, message: "검색키워드와 일치하는 가게가 없습니다." };
    }

    //검색한 데이터를 평점 내림차순으로 정리해 searchData 변수에 저장
    const searchData = [...searchStore, ...searchStore2].sort(
      (a, b) => b.rate - a.rate
    );

    return searchData;
  };

  findStoreId = async (storeId) => {
    const findStore = this.ordersRepository.findStoreById(storeId);

    if (!findStore) {
      return res.status(404).json({ message: "가게가 존재하지 않습니다." });
    }
    return findStore;
  };

  getOrderdata = async (storeId) => {
    const orderData = prisma.orders.findMany({
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
        menu: {
          select: {
            menuName: true,
          },
        },
        ea: true,
        orderAddress: true,
        totalPrice: true,
        orderContent: true,
        orderStatus: true,
        createdAt: true,
      },
    });
    return orderData;
  };
}
