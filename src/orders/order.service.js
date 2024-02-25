import { OrdersRepository } from "./order.repository.js";

export class OrdersService {
  ordersRepository = new OrdersRepository();

  // constructor(ordersRepository) {
  //   this.ordersRepository = ordersRepository;
  // }

  createOrder = async (
    userId,
    storeId,
    menuId,
    orderStatus,
    ea,
    orderContent
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
      orderStatus,
      ea,
      orderContent,
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
      throw new NotFoundError("검색키워드와 일치하는 가게가 없습니다.");
    }

    //검색한 데이터를 평점 내림차순으로 정리해 searchData 변수에 저장
    const searchData = [...searchStore, ...searchStore2].sort(
      (a, b) => b.rate - a.rate
    );

    return searchData;
  };

  //storeId로 해당 가게 검색하기
  findStoreId = async (storeId) => {
    const findStore = this.ordersRepository.findStoreById(storeId);

    if (!findStore) {
      throw new NotFoundError("가게가 존재하지 않습니다.");
    }
    return findStore;
  };

  //storeId로 주문받은 메뉴 확인하기
  getOrderdata = async (storeId) => {
    const orderData = this.ordersRepository.findOrderedMenu(storeId);
    return orderData;
  };
}
