export class OrdersController {
    constructor(ordersService, orderlistService) {
        this.ordersService = ordersService;
        this.orderlistService = orderlistService;
    }
    createOrder = async (req, res, next) => {
        try {
            const { userId } = req.user;
            const { storeId, menuId, orderStatus = "cooking", ea, orderContent, orderAddress } = req.body;

            const order = await this.ordersService.createOrder(userId, storeId, menuId, orderStatus, ea, orderContent, orderAddress);

            return res.status(201).json({ message: "주문에 성공하였습니다", data: order });
        } catch (err) {
            if (err.message === "포인트가 부족합니다.") {
                return res.status(403).json({ message: err.message });
            }
            next(err);
        }
    };

    userupdateOrder = async (req, res, next) => {
        try {
            const { orderId } = req.params;
            const { userId } = req.user;
            const { menuId, ea, orderContent, orderAddress } = req.body;

            const updatedOrder = await this.ordersService.userupdateOrder(orderId, userId, menuId, ea, orderContent, orderAddress);
            return res.status(200).json(updatedOrder);
        } catch (err) {
            next(err);
        }
    };
    drstatusup = async (req, res, next) => {
        try {
            const { orderId } = req.params;
            const { aduserId } = req.user;
            const { orderStatus = "deliveryready" } = req.body;
            const updatedOrder = await this.ordersService.drstatusup(orderId, aduserId, orderStatus);
            return res.status(200).json(updatedOrder);
        } catch (err) {
            next(err);
        }
    };
}
