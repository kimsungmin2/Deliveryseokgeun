export class OrdersService {
  constructor(ordersRepository) {
    this.ordersRepository = ordersRepository;
  }
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

    //검색키워드를 포함한 메뉴를 가진 storeId 호출
    const searchMenu = await prisma.menus.findMany({
      where: {
        menuName: {
          contains: search,
        },
      },
      select: {
        storeId: true,
      },
    });

    const storeIdList = searchMenu.map((menu) => +menu.storeId);

    //검색키워드를 포함한 메뉴를 가진 store의 정보들
    const searchStore2 = await prisma.stores.findMany({
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

    if (!searchStore && !searchStore2) {
      return res
        .status(200)
        .json({ message: "검색키워드와 일치하는 가게가 없습니다." });
    }

    //검색한 데이터를 평점 내림차순으로 정리해 searchData 변수에 저장
    const searchData = [...searchStore, ...searchStore2].sort(
      (a, b) => b.rate - a.rate
    );

    return searchData;
  };
}
