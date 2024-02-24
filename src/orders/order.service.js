export class OrdersService {
    constructor(ordersRepository, usersRepository, menusRepository, storesRepository, orderlistRepository) {
        this.ordersRepository = ordersRepository;
        this.usersRepository = usersRepository;
        this.menusRepository = menusRepository;
        this.storesRepository = storesRepository;
        this.orderlistRepository = orderlistRepository;
    }

    createOrder = async (userId, storeId, menuId, orderStatus = "cooking", ea, orderContent, orderAddress) => {
        const menu = await this.menusRepository.getMenuById(menuId);
        const totalPrice = menu.menuPrice * ea;
        console.log(menu);
        const store = await this.storesRepository.getStoreById(storeId);

        const user = await this.usersRepository.getUserById(userId);

        if (user.userpoint < totalPrice) {
            throw new Error("포인트가 부족합니다.");
        }

        const order = await this.ordersRepository.createOrder(userId, storeId, orderStatus, ea, orderContent, orderAddress, totalPrice);
        const orderlist = this.orderlistRepository.createOrderlist(order.orderId, menuId);
        const decrementdPoint = this.usersRepository.decrementPoint(userId, totalPrice);

        const tsorder = await this.ordersRepository.transaction([orderlist, decrementdPoint]);

        return order;
    };

    userupdateOrder = async (orderId, userId, menuId, ea, orderContent, orderAddress) => {
        const order = await this.ordersRepository.getOrderById(orderId);
        const cancelPrice = order.totalPrice;
        const incrementdPoint = await this.usersRepository.incrementPoint(userId, cancelPrice);

        const menu = await this.menusRepository.getMenuById(menuId);
        const totalPrice = menu.menuPrice * ea;

        const user = await this.usersRepository.getUserById(userId);
        if (user.userpoint < totalPrice) {
            throw new Error("포인트가 부족합니다.");
        }

        const updatedOrder = await this.ordersRepository.userupdateOrder(orderId, userId, ea, orderContent, orderAddress, totalPrice);
        const orderlist = this.orderlistRepository.updateOrderlist(orderId, menuId);
        const decrementdPoint = await this.usersRepository.decrementPoint(userId, totalPrice);

        return updatedOrder;
    };
    drstatusup = async (orderId, storId, orderStatus) => {
        const updatedOrder = await this.ordersRepository.drstatusup(orderId, storId, orderStatus);
        return updatedOrder;
    };
}
