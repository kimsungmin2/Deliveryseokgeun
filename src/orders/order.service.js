export class OrdersService {
    constructor(ordersRepository, usersRepository, menusRepository, storesRepository, orderlistRepository, pointsRepository, couponsRepository) {
        this.ordersRepository = ordersRepository;
        this.usersRepository = usersRepository;
        this.menusRepository = menusRepository;
        this.storesRepository = storesRepository;
        this.orderlistRepository = orderlistRepository;
        this.pointsRepository = pointsRepository;
        this.couponsRepository = couponsRepository;
    }
    createOrder = async (userId, storeId, menuIds, orderStatus = "cooking", eas, orderContent, orderAddress) => {
        const store = await this.storesRepository.getStoreById(storeId);
        let totalPrice = 0;
        for (let i = 0; i < menuIds.length; i++) {
            const menu = await this.menusRepository.getMenuById(menuIds[i]);
            if (!menu) {
                throw new Error(`ID가 ${menuIds[i]}인 메뉴를 찾을 수 없습니다.`);
            }
            const ea = eas[i];
            const price = menu.menuPrice;
            totalPrice += price * ea;

            if (menu.quantity < ea) {
                throw new Error("가능한 음식 갯수를 초과하였습니다.");
            }
        }

        const user = await this.pointsRepository.getUserPoint(userId);
        const userpoint = user[0]._sum.possession;
        if (userpoint < totalPrice) {
            throw new Error("포인트가 부족합니다.");
        }

        const order = await this.ordersRepository.createOrder(userId, storeId, orderStatus, orderContent, orderAddress, totalPrice);
        totalPrice = -totalPrice;
        const history = `주문 내역: ${store.storeName}에서 주문하셨습니다.)`;
        const decrementdPoint = this.pointsRepository.userdecrementPoint(userId, totalPrice, history);

        const orderlists = menuIds.map((menuId, index) => {
            return this.orderlistRepository.createOrderlist(order.orderId, menuId, eas[index]);
        });

        const menuquantities = menuIds.map((menuId, index) => {
            return this.menusRepository.decrementquantity(menuId, eas[index]);
        });

        const tsorder = await this.ordersRepository.transaction([...orderlists, decrementdPoint]);
        return tsorder;
    };

    percentagecreateOrder = async (userId, storeId, menuIds, orderStatus = "cooking", eas, orderContent, orderAddress, couponId) => {
        const date = new Date();
        const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        const store = await this.storesRepository.getStoreById(storeId);
        const coupon = await this.couponsRepository.getCouponId(couponId);

        if (coupon.couponuse !== "notuse") {
            throw new Error("사용한 쿠폰입니다.");
        }
        let totalPrice = 0;
        for (let i = 0; i < menuIds.length; i++) {
            const menu = await this.menusRepository.getMenuById(menuIds[i]);
            if (!menu) {
                throw new Error(`ID가 ${menuIds[i]}인 메뉴를 찾을 수 없습니다.`);
            }
            const ea = eas[i];
            const price = menu.menuPrice;
            totalPrice += price * ea;

            if (menu.quantity < ea) {
                throw new Error("가능한 음식 갯수를 초과하였습니다.");
            }
        }
        totalPrice -= totalPrice * (coupon.amount / 100);

        const user = await this.pointsRepository.getUserPoint(userId);
        const userpoint = user[0]._sum.possession;
        if (userpoint < totalPrice) {
            throw new Error("포인트가 부족합니다.");
        }
        if (totalPrice < coupon.certainamount) {
            throw new Error("주문 금액이 부족합니다.");
        }

        const order = await this.ordersRepository.createOrder(userId, storeId, orderStatus, orderContent, orderAddress, totalPrice);
        totalPrice = -totalPrice;
        const history = `주문 내역: ${store.storeName}에서 주문하셨습니다.)`;
        const decrementdPoint = this.pointsRepository.userdecrementPoint(userId, totalPrice, history);
        const use = `${formattedDate}일, ${store.storeName}에서 사용했습니다`;
        const coupons = this.couponsRepository.updeteCoupon(couponId, use, history);
        const orderlists = menuIds.map((menuId, index) => {
            return this.orderlistRepository.createOrderlist(order.orderId, menuId, eas[index]);
        });

        const menuquantities = menuIds.map((menuId, index) => {
            return this.menusRepository.decrementquantity(menuId, eas[index]);
        });

        const tsorder = await this.ordersRepository.transaction([...orderlists, decrementdPoint]);
        return tsorder;
    };
    discountcreateOrder = async (userId, storeId, menuIds, orderStatus = "cooking", eas, orderContent, orderAddress, couponId) => {
        const date = new Date();
        const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        const store = await this.storesRepository.getStoreById(storeId);
        const coupon = await this.couponsRepository.getCouponId(couponId);
        console.log(coupon);
        if (coupon.couponuse !== "notuse") {
            throw new Error("사용한 쿠폰입니다.");
        }
        let totalPrice = 0;
        for (let i = 0; i < menuIds.length; i++) {
            const menu = await this.menusRepository.getMenuById(menuIds[i]);
            if (!menu) {
                throw new Error(`ID가 ${menuIds[i]}인 메뉴를 찾을 수 없습니다.`);
            }
            const ea = eas[i];
            const price = menu.menuPrice;
            totalPrice += price * ea;

            if (menu.quantity < ea) {
                throw new Error("가능한 음식 갯수를 초과하였습니다.");
            }
        }
        totalPrice -= coupon.amount;

        const user = await this.pointsRepository.getUserPoint(userId);
        const userpoint = user[0]._sum.possession;
        if (userpoint < totalPrice) {
            throw new Error("포인트가 부족합니다.");
        }
        if (totalPrice < coupon.certainamount) {
            throw new Error("주문 금액이 부족합니다.");
        }
        const order = await this.ordersRepository.createOrder(userId, storeId, orderStatus, orderContent, orderAddress, totalPrice);
        totalPrice = -totalPrice;
        const history = `주문 내역: ${store.storeName}에서 주문하셨습니다.)`;
        const decrementdPoint = this.pointsRepository.userdecrementPoint(userId, totalPrice, history);
        const use = `${formattedDate}일, ${store.storeName}에서 사용했습니다`;
        const coupons = this.couponsRepository.updeteCoupon(couponId, use, history);

        const orderlists = menuIds.map((menuId, index) => {
            return this.orderlistRepository.createOrderlist(order.orderId, menuId, eas[index]);
        });

        const menuquantities = menuIds.map((menuId, index) => {
            return this.menusRepository.decrementquantity(menuId, eas[index]);
        });

        const tsorder = await this.ordersRepository.transaction([...orderlists, decrementdPoint]);
        return tsorder;
    };

    getOrderById = async (orderId) => {
        const order = await this.ordersRepository.getOrderById(orderId);
        if (!order) throw new Error("존재하지 않는 오더입니다.");
        return order;
    };
    // createOrder = async (userId, storeId, menuId, orderStatus = "cooking", ea, orderContent, orderAddress) => {
    //     const menu = await this.menusRepository.getMenuById(menuId);
    //     const totalPrice = menu.menuPrice * ea;
    //     console.log(menu);
    //     const store = await this.storesRepository.getStoreById(storeId);

    //     const user = await this.usersRepository.getUserById(userId);

    //     if (user.userpoint < totalPrice) {
    //         throw new Error("포인트가 부족합니다.");
    //     }

    //     const order = await this.ordersRepository.createOrder(userId, storeId, orderStatus, ea, orderContent, orderAddress, totalPrice);
    //     const orderlist = this.orderlistRepository.createOrderlist(order.orderId, menuId);
    //     const decrementdPoint = this.usersRepository.decrementPoint(userId, totalPrice);

    //     const tsorder = await this.ordersRepository.transaction([orderlist, decrementdPoint]);

    //     return order;
    // };

    // userupdateOrder = async (orderId, userId, menuId, ea, orderContent, orderAddress) => {
    //     const order = await this.ordersRepository.getOrderById(orderId);
    //     const cancelPrice = order.totalPrice;
    //     const incrementdPoint = await this.usersRepository.incrementPoint(userId, cancelPrice);

    //     const menu = await this.menusRepository.getMenuById(menuId);
    //     const totalPrice = menu.menuPrice * ea;

    //     const user = await this.usersRepository.getUserById(userId);
    //     if (user.userpoint < totalPrice) {
    //         throw new Error("포인트가 부족합니다.");
    //     }

    //     const updatedOrder = await this.ordersRepository.userupdateOrder(orderId, userId, ea, orderContent, orderAddress, totalPrice);
    //     const orderlist = this.orderlistRepository.updateOrderlist(orderId, menuId);
    //     const decrementdPoint = await this.usersRepository.decrementPoint(userId, totalPrice);

    //     return updatedOrder;
    // };
    deleteOrder = async (orderId, userId) => {
        const order = await this.ordersRepository.getOrderById(orderId);
        if (!order) {
            throw new Error("해당 오더를 찾을 수 없습니다.");
        }
        const cancelPrice = order.totalPrice;
        const Pasthistory = `주문하신 점포의 주문이 취소되었습니다.`;
        const incrementdPoint = this.pointsRepository.userdecrementPoint(userId, cancelPrice, Pasthistory);

        const deletedResume = await this.ordersRepository.deleteOrder(orderId, userId);
        const tsorder = await this.ordersRepository.transaction([incrementdPoint]);
        return { message: "주문하신 점포의 주문이 취소되었습니다." };
    };
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
}
