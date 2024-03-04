export class OrdersController {
    constructor(ordersService, storesService, couponsService) {
        this.ordersService = ordersService;
        this.storesService = storesService;
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

            let order;

            if (couponId) {
                const coupon = await this.couponsService.getCouponId(couponId);
                if (!coupon) return res.status(403).json({ message: "쿠폰을 확인해주세요." });
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
            console.log(order);

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
            const { aduserId } = req.aduser;

            const order = await this.ordersService.getOrderById(orderId);

            //orderId로 store 불러와서 그 안에서 aduser 가져오기
            const store = await this.storesService.getStorebyAdId(aduserId);

            if (store.aduserId !== aduserId) return res.status(401).json({ message: "권한이 없습니다." });

            return res.status(200).json({ data: order });
        } catch (err) {
            next(err);
        }
    };

    deleteOrder = async (req, res, next) => {
        try {
            const { orderId } = req.params;
            const { userId } = req.user;
            const order = await this.ordersService.getOrderById(orderId);

            if (!orderId) {
                return res.status(404).json({ message: "주문이 없습니다." });
            }

            if (!order.userId !== userId) return res.status(401).json({ message: "권한이 없습니다." });

            await this.ordersService.deleteOrder(orderId, userId);

            return res.status(200).json({ message: "배달이 취소되었습니다." });
        } catch (err) {
            next(err);
        }
    };
}
