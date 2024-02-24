export class OrdersController {
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    createOrder = async (req, res, next) => {
        try {
            const { userId } = req.user;
            const { storeId, menuId, orderStatus = "cooking", ea, orderContent, orderAddress } = req.body;

            const order = await this.ordersService.createOrder(userId, storeId, menuId, orderStatus, ea, orderContent, orderAddress);

            return res.status(201).json({ message: "주문에 성공하였습니다", data: order });
        } catch (err) {
            next(err);
        }
    };
}
