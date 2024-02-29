import { ValidationError } from "../common.error.js";
import { UnauthorizedError } from "../common.error.js";
import { NotFoundError } from "../common.error.js";
import { ConflictError } from "../common.error.js";
import { ForbiddenError } from "../common.error.js";
import { WebClient } from "@slack/web-api";

export class OrdersService {
    constructor(ordersRepository, usersRepository, menusRepository, storesRepository, orderlistRepository, pointsRepository, couponsRepository) {
        this.ordersRepository = ordersRepository;
        this.usersRepository = usersRepository;
        this.menusRepository = menusRepository;
        this.storesRepository = storesRepository;
        this.orderlistRepository = orderlistRepository;
        this.pointsRepository = pointsRepository;
        this.couponsRepository = couponsRepository;
    }
    sendTodayData = async () => {
        try {
            const token = process.env.SLACK_TOKEN;
            const channel = process.env.SLACK_CHANNEL;
            const slackBot = new WebClient(token);
            const message = "주문이 들어왔습니다. 확인해주세요.";
            await slackBot.chat.postMessage({
                channel: channel,
                text: message,
            });
        } catch (err) {
            console.log(err.message);
        }
    };
    createOrder = async (userId, storeId, menuIds, orderStatus = "cooking", eas, orderContent, orderAddress) => {
        const store = await this.storesRepository.getStoreById(storeId);
        const user = await this.pointsRepository.getUserPoint(userId);
        const userrating = await this.usersRepository.getUserById(userId);
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
            if (userrating.rating === "rare") {
                totalPrice -= totalPrice * (3 / 100);
            } else if (userrating.rating === "epic") {
                totalPrice -= totalPrice * (5 / 100);
            }

            const userpoint = user[0]._sum.possession;
            if (userpoint < totalPrice) {
                throw new ForbiddenError("포인트가 부족합니다.");
            }
        }

        const order = await this.ordersRepository.createOrder(userId, storeId, orderStatus, orderContent, orderAddress, totalPrice);
        totalPrice = -totalPrice;
        const history = `주문 내역: ${store.storeName}에서 주문하셨습니다.)`;
        const decrementdPoint = this.pointsRepository.userdecrementPoint(userId, totalPrice, history);

        const orderlists = menuIds.map((menuId, index) => {
            return this.orderlistRepository.createOrderlist(order.orderId, menuId, eas[index]);
        });

        const menuquantities = menuIds.map((menuId, index) => {
            return this.menusRepository.decrementquantity(menuId, eas[index]);
        });

        const tsorder = await this.ordersRepository.transaction([...orderlists, decrementdPoint]);
        await this.sendTodayData();
        return tsorder;
    };

    percentagecreateOrder = async (userId, storeId, menuIds, orderStatus = "cooking", eas, orderContent, orderAddress, couponId) => {
        const date = new Date();
        const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        const store = await this.storesRepository.getStoreById(storeId);
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
        console.log(totalPrice);
        if (totalPrice < coupon.certainamount) {
            throw new ForbiddenError("주문 금액이 부족합니다.");
        }
        totalPrice -= totalPrice * (coupon.amount / 100);

        const user = await this.pointsRepository.getUserPoint(userId);
        const userpoint = user[0]._sum.possession;
        if (userpoint < totalPrice) {
            throw new ForbiddenError("포인트가 부족합니다.");
        }

        const order = await this.ordersRepository.createOrder(userId, storeId, orderStatus, orderContent, orderAddress, totalPrice);
        totalPrice = -totalPrice;
        const history = `주문 내역: ${store.storeName}에서 주문하셨습니다.)`;
        const decrementdPoint = this.pointsRepository.userdecrementPoint(userId, totalPrice, history);
        const use = `${formattedDate}일, ${store.storeName}에서 사용했습니다`;
        const coupons = this.couponsRepository.updeteCoupon(couponId, use, history);
        const orderlists = menuIds.map((menuId, index) => {
            return this.orderlistRepository.createOrderlist(order.orderId, menuId, eas[index]);
        });

        const menuquantities = menuIds.map((menuId, index) => {
            return this.menusRepository.decrementquantity(menuId, eas[index]);
        });

        const tsorder = await this.ordersRepository.transaction([...orderlists, decrementdPoint]);
        await this.sendTodayData();
        return tsorder;
    };
    discountcreateOrder = async (userId, storeId, menuIds, orderStatus = "cooking", eas, orderContent, orderAddress, couponId) => {
        const date = new Date();
        const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        const store = await this.storesRepository.getStoreById(storeId);
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
            if (totalPrice < coupon.certainamount) {
                throw new ForbiddenError("주문 금액이 부족합니다.");
            }
        }
        totalPrice -= coupon.amount;

        const user = await this.pointsRepository.getUserPoint(userId);
        const userpoint = user[0]._sum.possession;
        if (userpoint <= totalPrice) {
            throw new ForbiddenError("포인트가 부족합니다.");
        }

        const order = await this.ordersRepository.createOrder(userId, storeId, orderStatus, orderContent, orderAddress, totalPrice);
        totalPrice = -totalPrice;
        const history = `주문 내역: ${store.storeName}에서 주문하셨습니다.)`;
        const decrementdPoint = this.pointsRepository.userdecrementPoint(userId, totalPrice, history);
        const use = `${formattedDate}일, ${store.storeName}에서 사용했습니다`;
        const coupons = this.couponsRepository.updeteCoupon(couponId, use, history);

        const orderlists = menuIds.map((menuId, index) => {
            return this.orderlistRepository.createOrderlist(order.orderId, menuId, eas[index]);
        });

        const menuquantities = menuIds.map((menuId, index) => {
            return this.menusRepository.decrementquantity(menuId, eas[index]);
        });

        const tsorder = await this.ordersRepository.transaction([...orderlists, decrementdPoint]);
        await this.sendTodayData();
        return tsorder;
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
