export class OrdersController {
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    createResume = async (req, res, next) => {
        try {
            const { storeId } = req.params;
            const { userId } = req.user;
            const { menuId, ea, ordercontent, orderstatus = "cooking" } = req.body;

            const order = await this.resumesService.createResume(userId, storeId, menuId, orderstatus, ea, ordercontent);

            return res.status(201).json({ message: "주문에 성공하였습니다", data: order });
        } catch (err) {
            next(err);
        }
    };
}
