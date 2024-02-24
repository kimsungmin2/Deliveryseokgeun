import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
export class StoresService {
    constructor(storesRepository, pointsRepository, ordersRepository) {
        this.storesRepository = storesRepository;
        this.pointsRepository = pointsRepository;
        this.ordersRepository = ordersRepository;
    }
    signIn = async (email, password) => {
        const store = await this.storesRepository.getStoreByEmail(email);

        const storeJWT = jwt.sign({ storeId: store.storeId }, process.env.JWT_SECRET, { expiresIn: "12h" });
        const refreshToken = jwt.sign({ storeId: store.storeId }, process.env.REFRESH_SECRET, { expiresIn: "7d" });

        return { storeJWT, refreshToken };
    };
    getStoreById = async (storeId) => {
        const store = await this.storesRepository.getStoreById(storeId);
        if (!store) throw new Error("존재하지 않는 상점입니다.");
        return store;
    };
    readystatusup = async (orderId, storeId, orderStatus = "deliveryready") => {
        const updatedOrder = await this.storesRepository.readystatusup(orderId, storeId, orderStatus);
        return updatedOrder;
    };

    ingstatusup = async (orderId, storeId, orderStatus = "delivering") => {
        const updatedOrder = await this.storesRepository.ingstatusup(orderId, storeId, orderStatus);
        return updatedOrder;
    };
    completestatusup = async (orderId, storeId, orderStatus = "deliverycompleted") => {
        const order = await this.ordersRepository.getOrderById(orderId);
        console.log(order);
        const totalPrice = order.totalPrice;
        const history = `${order.orderId}번 주문의 배달이 완료되어 ${order.totalPrice}원이 입금되었습니다.)`;
        const decrementdPoint = await this.pointsRepository.storedecrementPoint(storeId, totalPrice, history);
        const updatedOrder = await this.storesRepository.completestatusup(orderId, storeId, orderStatus);
        return updatedOrder;
    };
}
