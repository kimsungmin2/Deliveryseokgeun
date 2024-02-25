export class OrdersController {
    constructor(ordersService, storesService, orderlistService) {
        this.ordersService = ordersService;
        this.storesService = storesService;
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
    getOrderById = async (req, res, next) => {
        try {
            const { orderId } = req.params;
            const order = await this.ordersService.getOrderById(orderId);

            return res.status(200).json({ data: order });
        } catch (err) {
            next(err);
        }
    };
    userupdateOrder = async (req, res, next) => {
        try {
            const { orderId } = req.params;
            const { userId } = req.user;
            const { storeId, menuId, ea, orderContent, orderAddress } = req.body;
            const order = await this.ordersService.getOrderById(orderId);
            if (!order) return res.status(404).json({ message: "해당 페이지를 찾을 수 없습니다" });
            const updatedOrder = await this.ordersService.userupdateOrder(orderId, userId, storeId, menuId, ea, orderContent, orderAddress);
            return res.status(200).json(updatedOrder);
        } catch (err) {
            if (err.message === "포인트가 부족합니다.") {
                return res.status(403).json({ message: err.message });
            }
            next(err);
        }
    };
    deleteOrder = async (req, res, next) => {
        try {
            const { orderId } = req.params;
            const { userId } = req.user;

            const user = req.user.userId;

            if (!user) return res.status(401).json({ message: "권한이 없습니다." });

            const deletedOrder = await this.ordersService.deleteOrder(orderId, userId);

            res.status(200).json({ message: "삭제 성공" });
        } catch (err) {
            next(err);
        }
    };
}
