export class OrdersService {
    constructor(ordersRepository) {
        this.ordersRepository = ordersRepository;
    }
    createOrder = async (userId, storeId, menuId, orderstatus, ea, ordercontent) => {
        const menu = await this.menuRepository.getMenuById(menuId);

        const totalPrice = menu.price * ea;

        const user = await this.userRepository.getUserById(userId);

        if (user.userpoint < totalPrice) {
            throw new Error("잔액이 부족합닌다");
        }

        const order = await this.ordersRepository.createOrder(userId, storeId, menuId, orderstatus, ea, ordercontent, totalPrice);

        await this.userRepository.decrementPoint(userId, totalPrice);

        return order;
    };
}
