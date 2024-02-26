export class OrdersController {
    constructor(ordersService, storesService, orderlistService, couponsService) {
        this.ordersService = ordersService;
        this.storesService = storesService;
        this.orderlistService = orderlistService;
        this.couponsService = couponsService;
    }
    createOrder = async (req, res, next) => {
        try {
            const { userId } = req.user;
            const { storeId, menuIds, orderStatus = "cooking", eas, orderContent, orderAddress, couponId } = req.body;
            if (!storeId) {
                return res.status(403).json({ message: "음식점 입력은 필수입니다." });
            }
            if (!menuIds || menuIds.length === 0) {
                return res.status(403).json({ message: "메뉴 선택은 필수입니다." });
            }
            if (!eas || eas.length !== menuIds.length) {
                return res.status(403).json({ message: "메뉴의 수량을 제대로 입력해주세요." });
            }
            if (orderAddress.length === 0) {
                return res.status(403).json({ message: "주소 입력은 필수입니다." });
            }

            const coupon = await this.couponsService.getCouponId(couponId);

            let order;
            if (!coupon) return res.status(403).json({ message: "쿠폰을 확인해주세요." });
            if (couponId) {
                if (coupon && coupon.discount === "percentage") {
                    order = await this.ordersService.percentagecreateOrder(
                        userId,
                        storeId,
                        menuIds,
                        orderStatus,
                        eas,
                        orderContent,
                        orderAddress,
                        couponId
                    );
                } else {
                    order = await this.ordersService.discountcreateOrder(
                        userId,
                        storeId,
                        menuIds,
                        orderStatus,
                        eas,
                        orderContent,
                        orderAddress,
                        couponId
                    );
                }
            } else {
                order = await this.ordersService.createOrder(userId, storeId, menuIds, orderStatus, eas, orderContent, orderAddress);
            }

            return res.status(201).json({ message: "주문에 성공하였습니다", data: order });
        } catch (err) {
            if (err.message === "포인트가 부족합니다.") {
                return res.status(403).json({ message: err.message });
            }
            if (err.message === "가능한 음식 갯수를 초과하였습니다.") {
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
