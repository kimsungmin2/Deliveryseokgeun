export class OrdersService {
    constructor(ordersRepository, usersRepository, menusRepository, storesRepository, orderlistRepository, pointsRepository) {
        this.ordersRepository = ordersRepository;
        this.usersRepository = usersRepository;
        this.menusRepository = menusRepository;
        this.storesRepository = storesRepository;
        this.orderlistRepository = orderlistRepository;
        this.pointsRepository = pointsRepository;
    }

    createOrder = async (userId, storeId, menuId, orderStatus = "cooking", ea, orderContent, orderAddress) => {
        const store = await this.storesRepository.getStoreById(storeId);
        const menu = await this.menusRepository.getMenuById(menuId);
        let totalPrice = menu.menuPrice * ea;

        const user = await this.pointsRepository.getUserPoint(userId);
        const userpoint = user[0]._sum.possession;
        if (userpoint < totalPrice) {
            throw new Error("포인트가 부족합니다.");
        }

        const order = await this.ordersRepository.createOrder(userId, storeId, orderStatus, ea, orderContent, orderAddress, totalPrice);
        totalPrice = -totalPrice;
        const history = `주문 내역: ${store.storeName}에서${menu.menuName}을(를) 주문하셨습니다.)`;
        const decrementdPoint = this.pointsRepository.userdecrementPoint(userId, totalPrice, history);
        console.log(userpoint);
        const orderlist = this.orderlistRepository.createOrderlist(order.orderId, menuId);

        const tsorder = await this.ordersRepository.transaction([decrementdPoint, orderlist]);
        return tsorder;
    };

    userupdateOrder = async (orderId, userId, storeId, menuId, ea, orderContent, orderAddress) => {
        const order = await this.ordersRepository.getOrderById(orderId);
        const cancelPrice = order.totalPrice;
        const user = await this.pointsRepository.getUserPoint(userId);
        const store = await this.storesRepository.getStoreById(storeId);
        const Pasthistory = `주문 하신 점포 ${store.storeName}의 주문이 변경 되었습니다.`;
        const incrementdPoint = this.pointsRepository.userdecrementPoint(userId, cancelPrice, Pasthistory);

        const menu = await this.menusRepository.getMenuById(menuId);
        let totalPrice = menu.menuPrice * ea;

        const userpoint = user[0]._sum.possession;
        if (userpoint < totalPrice) {
            throw new Error("포인트가 부족합니다.");
        }
        const updatedOrder = await this.ordersRepository.userupdateOrder(orderId, userId, ea, orderContent, orderAddress, totalPrice);
        totalPrice = -totalPrice;
        const history = `주문 내역: ${store.storeName}에서${menu.menuName}을(를) 으로 변경하셨습니다.)`;
        const decrementdPoint = this.pointsRepository.userdecrementPoint(userId, totalPrice, history);
        const orderlist = this.orderlistRepository.createOrderlist(orderId, menuId);

        const tsorder = await this.ordersRepository.transaction([incrementdPoint, decrementdPoint, orderlist]);
        return updatedOrder;
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
            throw new Error("해당 이력서를 찾을 수 없습니다.");
        }
        const cancelPrice = order.totalPrice;
        const Pasthistory = `주문 하신 점포의 주문이 취소되었습니다.`;
        const incrementdPoint = this.pointsRepository.userdecrementPoint(userId, cancelPrice, Pasthistory);

        const deletedResume = await this.ordersRepository.deleteOrder(orderId, userId);
        const tsorder = await this.ordersRepository.transaction([incrementdPoint]);
        return { message: "삭제 성공" };
    };
}
