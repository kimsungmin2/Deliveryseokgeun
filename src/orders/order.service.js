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

        const store = await this.storesRepository.getStoreById(storeId);
        const user = await this.usersRepository.getUserById(userId);

        if (user.userpoint < totalPrice) {
            throw new Error("잔액이 부족합니다");
        }

        const order = await this.ordersRepository.createOrder(userId, storeId, orderStatus, ea, orderContent, orderAddress, totalPrice);

        const orderlist = await this.orderlistRepository.createOrderlist(order.orderId, menuId, ea);

        await this.usersRepository.decrementPoint(userId, totalPrice);

        return order;
    };
}
