import { ValidationError } from "../common.error.js";
import { UnauthorizedError } from "../common.error.js";
import { NotFoundError } from "../common.error.js";
import { ConflictError } from "../common.error.js";
import { ForbiddenError } from "../common.error.js";
import { sendTodayData } from "../middlewares/slack.middlewares.js";

export class OrdersService {
    constructor(ordersRepository, usersRepository, menusRepository, storesRepository, pointsRepository, couponsRepository) {
        this.ordersRepository = ordersRepository;
        this.usersRepository = usersRepository;
        this.menusRepository = menusRepository;
        this.storesRepository = storesRepository;
        this.pointsRepository = pointsRepository;
        this.couponsRepository = couponsRepository;
    }

    createOrder = async (userId, storeId, menuIds, orderStatus, eas, orderContent, orderAddress) => {
        const user = await this.pointsRepository.getUserPoint(userId);
        const userRating = await this.usersRepository.getUserById(userId);
        let totalPrice = 0;
        for (let i = 0; i < menuIds.length; i++) {
            const menu = await this.menusRepository.getMenuById(menuIds[i]);
            if (!menu) {
                throw new NotFoundError(`ID가 ${menuIds[i]}인 메뉴를 찾을 수 없습니다.`);
            }
            const ea = eas[i];
            const price = menu.menuPrice;
            totalPrice += price * ea;

            if (menu.quantity < ea) {
                throw new ForbiddenError("가능한 음식 갯수를 초과하였습니다.");
            }
            if (userRating.rating === "rare") {
                totalPrice -= totalPrice * (3 / 100);
            } else if (userRating.rating === "epic") {
                totalPrice -= totalPrice * (5 / 100);
            }

            const userPoint = user[0]._sum.possession;
            if (userPoint < totalPrice) {
                throw new ForbiddenError("포인트가 부족합니다.");
            }
        }

        const menuQuantity = menuIds.map((menuId, ea) => {
            return { menuId: menuId, ea: ea };
        });

        const order = await this.ordersRepository.createOrder(userId, storeId, orderStatus, orderContent, orderAddress, totalPrice, menuQuantity);
        sendTodayData();
        return order;
    };

    createOrderWithDiscountPercentage = async (userId, storeId, menuIds, orderStatus, eas, orderContent, orderAddress, couponId) => {
        const coupon = await this.couponsRepository.getCouponId(couponId);
        console.log(coupon);
        if (coupon.couponuse !== "notuse") {
            throw new ForbiddenError("사용한 쿠폰입니다.");
        }
        let totalPrice = 0;
        for (let i = 0; i < menuIds.length; i++) {
            const menu = await this.menusRepository.getMenuById(menuIds[i]);
            if (!menu) {
                throw new NotFoundError(`ID가 ${menuIds[i]}인 메뉴를 찾을 수 없습니다.`);
            }
            const ea = eas[i];
            const price = menu.menuPrice;
            totalPrice += price * ea;

            if (menu.quantity < ea) {
                throw new ForbiddenError("가능한 음식 갯수를 초과하였습니다.");
            }
        }
        if (totalPrice < coupon.certainamount) {
            throw new ForbiddenError("주문 금액이 부족합니다.");
        }
        totalPrice -= totalPrice * (coupon.amount / 100);

        const user = await this.pointsRepository.getUserPoint(userId);
        const userPoint = user[0]._sum.possession;
        if (userPoint < totalPrice) {
            throw new ForbiddenError("포인트가 부족합니다.");
        }
        const menuQuantity = menuIds.map((menuId, ea) => {
            return { menuId: menuId, ea: ea };
        });
        const order = await this.ordersRepository.createCouponOrder(
            userId,
            storeId,
            orderStatus,
            orderContent,
            orderAddress,
            totalPrice,
            menuQuantity,
            couponId
        );

        sendTodayData();
        return order;
    };
    // 이름 바꾸기 카멜케이스, 변수이름 , 스토어가 왜 있는지에 대해서,cdc,트리거? ,event driven handling,이게 서비스 계층에 있어야 할까?, 질문을 던질 때 다른 방법이 있다,
    //합당한 이유 가 필요,change data capher
    createOrderWithDiscount = async (userId, storeId, menuIds, orderStatus, eas, orderContent, orderAddress, couponId) => {
        const coupon = await this.couponsRepository.getCouponId(couponId);

        if (coupon.couponuse !== "notuse") {
            throw new ForbiddenError("사용한 쿠폰입니다.");
        }
        let totalPrice = 0;
        for (let i = 0; i < menuIds.length; i++) {
            const menu = await this.menusRepository.getMenuById(menuIds[i]);
            if (!menu) {
                throw new NotFoundError(`ID가 ${menuIds[i]}인 메뉴를 찾을 수 없습니다.`);
            }
            const ea = eas[i];
            const price = menu.menuPrice;
            totalPrice += price * ea;

            if (menu.quantity < ea) {
                throw new ForbiddenError("가능한 음식 갯수를 초과하였습니다.");
            }
        }
        if (totalPrice < coupon.certainamount) {
            throw new ForbiddenError("주문 금액이 부족합니다.");
        }
        totalPrice -= coupon.amount;

        const user = await this.pointsRepository.getUserPoint(userId);
        const userPoint = user[0]._sum.possession;
        if (userPoint < totalPrice) {
            throw new ForbiddenError("포인트가 부족합니다.");
        }
        const menuQuantity = menuIds.map((menuId, ea) => {
            return { menuId: menuId, ea: ea };
        });
        const order = await this.ordersRepository.createCouponOrder(
            userId,
            storeId,
            orderStatus,
            orderContent,
            orderAddress,
            totalPrice,
            menuQuantity,
            couponId
        );

        sendTodayData();
        return order;
    };

    getOrderById = async (orderId) => {
        const order = await this.ordersRepository.getOrderById(orderId);
        if (!order) throw new NotFoundError("존재하지 않는 오더입니다.");
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
            throw new NotFoundError("해당 오더를 찾을 수 없습니다.");
        }
        const cancelPrice = order.totalPrice;
        const Pasthistory = `주문하신 점포의 주문이 취소되었습니다.`;
        const incrementdPoint = this.pointsRepository.userdecrementPoint(userId, cancelPrice, Pasthistory);

        const deletedResume = await this.ordersRepository.deleteOrder(orderId, userId);
        const tsorder = await this.ordersRepository.transaction([incrementdPoint]);
        return { message: "주문하신 점포의 주문이 취소되었습니다." };
    };
}
