import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
export class StoresService {
    constructor(storesRepository, pointsRepository, ordersRepository) {
        this.storesRepository = storesRepository;
        this.pointsRepository = pointsRepository;
        this.ordersRepository = ordersRepository;
    }
    signIn = async (adEmail, adPassword) => {
        const aduser = await this.storesRepository.getStoreByEmail(adEmail);

        const storeJWT = jwt.sign({ aduserId: aduser.aduserId }, process.env.JWT_SECRET, { expiresIn: "12h" });
        const refreshToken = jwt.sign({ aduserId: aduser.aduserId }, process.env.REFRESH_SECRET, { expiresIn: "7d" });

        return { storeJWT, refreshToken };
    };
    // 가게정보 생성
    createStoreInfo = async (aduserId, storeName, storeAddress, storeContact, storeContent, storeCategory ) => {
        const storeInfo = await this.storesRepository.createStoreInfo(aduserId, storeName, storeAddress, storeContact, storeContent, storeCategory)
        return storeInfo
    }
    // 가게정보 상세조회
     getStoreById = async (storeId) => {
        const store = await this.storesRepository.getStoreById(storeId);
        if (!store) throw new Error("존재하지 않는 상점입니다.");
        return store;
    };
    readystatusup = async (orderId, storeId, orderStatus) => {
        const order = await this.ordersRepository.getOrderById(orderId);
        if (!order) {
            throw new Error("해당 주문을 찾을 수 없습니다.");
        }
        if (orderStatus !== "deliveryReady") {
            throw new Error("주문 변경에 실패하였습니다.");
        }
        const updatedOrder = await this.storesRepository.readystatusup(orderId, storeId, orderStatus);
        return updatedOrder;
    };

    ingstatusup = async (orderId, storeId, orderStatus) => {
        const order = await this.ordersRepository.getOrderById(orderId);
        if (!order) {
            throw new Error("해당 주문을 찾을 수 없습니다.");
        }
        if (orderStatus !== "delivering") {
            throw new Error("주문 변경에 실패하였습니다.");
        }
        const updatedOrder = await this.storesRepository.ingstatusup(orderId, storeId, orderStatus);
        return updatedOrder;
    };
    completestatusup = async (orderId, storeId, orderStatus) => {
        const order = await this.ordersRepository.getOrderById(orderId);
        if (!order) {
            throw new Error("해당 주문을 찾을 수 없습니다.");
        }
        if (orderStatus !== "deliveryCompleted") {
            throw new Error("주문 변경에 실패하였습니다.");
        }
        const totalPrice = order.totalPrice;
        const history = `${order.orderId}번 주문의 배달이 완료되어 ${order.totalPrice}원이 입금되었습니다.)`;
        const decrementdPoint = await this.pointsRepository.storedecrementPoint(storeId, totalPrice, history);
        const updatedOrder = await this.storesRepository.completestatusup(orderId, storeId, orderStatus);
        return updatedOrder;
    };

    deleteOrder = async (orderId, storeId) => {
        const order = await this.ordersRepository.getOrderById(orderId);
        if (!order) {
            throw new Error("해당 주문을 찾을 수 없습니다.");
        }
        const user = order.userId;
        const cancelPrice = order.totalPrice;
        const Pasthistory = `주문하신 점포의 주문이 취소되었습니다.`;
        const incrementdPoint = this.pointsRepository.userdecrementPoint(user, cancelPrice, Pasthistory);

        const deletedOrder = await this.ordersRepository.deleteOrder(orderId, storeId);
        const tsorder = await this.ordersRepository.transaction([incrementdPoint]);
        return deletedOrder;
    };
    // 가게 목록
    getStoreList = async () => {
        const storeList = await this.storesRepository.getStoreList()
        return storeList
    }
    // 가게 정보 수정
    updateStoreInfo = async (storeId, user, storeName, storeAddress, storeContact, storeContent, storeCategory) => {
        const store = await this.storesRepository.getStoreInfo(storeId)
        if (!store) {
            throw new Error("존재하지 않는 가게 입니다.");
          }
          if (store.userId !== user) {
            throw new Error("본인 가게만 수정 가능합니다.");
          }
        await this.storesRepository.updateStoreInfo(storeId, user, storeName, storeAddress, storeContact, storeContent, storeCategory)
    }
    // 가게 정보 삭제
    deleteStoreInfo = async (storeId, aduserId) => {
        const store = await this.storesRepository.deleteStoreInfo(storeId, aduserId);
        return store;
    };
}
