import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { NotFoundError } from "../common.error.js";
import { ValidationError } from "../common.error.js";
import { UnauthorizedError } from "../common.error.js";
import { ConflictError } from "../common.error.js";
import { ForbiddenError } from "../common.error.js";
import { WebClient } from "@slack/web-api";

dotenv.config();

export class StoresService {
    constructor(storesRepository, pointsRepository, ordersRepository, menusRepository, usersRepository) {
        this.storesRepository = storesRepository;
        this.pointsRepository = pointsRepository;
        this.ordersRepository = ordersRepository;
        this.menusRepository = menusRepository;
        this.usersRepository = usersRepository;
    }

    sendTodayData = async (storeId, orderId) => {
        try {
            const token = process.env.SLACK_TOKEN;
            const channel = process.env.SLACK_CHANNEL;
            const slackBot = new WebClient(token);
            const order = await this.ordersRepository.getOrderById(orderId);
            const user = await this.usersRepository.getUserById(order.userId);
            let message;
            console.log(order);
            if (order.orderStatus === "deliveryReady") {
                message = `${user.name}님${storeId.storeName}에서 음식을 준비하고 있습니다.`;
            } else if (order.orderStatus === "delivering") {
                message = `${user.name}님${storeId.storeName}에서 배달을 시작했습니다.`;
            } else {
                message = `${user.name}님${storeId.storeName}에서 배달이 완료되었습니다.`;
            }

            await slackBot.chat.postMessage({
                channel: channel,
                text: message,
            });
        } catch (err) {
            console.log(err.message);
        }
    };

    // 로그인
    signIn = async (adEmail, adPassword) => {
        const aduser = await this.storesRepository.getStoreByEmail(adEmail);
        const storeJWT = jwt.sign({ aduserId: aduser.aduserId }, process.env.JWT_SECRET, { expiresIn: "12h" });
        const refreshToken = jwt.sign({ aduserId: aduser.aduserId }, process.env.REFRESH_SECRET, { expiresIn: "7d" });
        return { storeJWT, refreshToken };
    };
    // 가게정보 생성
    createStoreInfo = async (aduserId, storeName, storeAddress, storeContact, storeContent, storeCategory) => {
        const findStoreId = await this.storesRepository.findStoreId(aduserId);
        if (findStoreId) {
            throw new NotFoundError("가게 정보는 1개만 생성 가능 합니다.");
        }
        const storeInfo = await this.storesRepository.createStoreInfo(aduserId, storeName, storeAddress, storeContact, storeContent, storeCategory);
        return storeInfo;
    };
    // 가게정보 상세조회
    getStoreById = async (storeId) => {
        const store = await this.storesRepository.getStoreById(storeId);
        if (!store) throw new NotFoundError("등록된 가게가 없습니다.");
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
        console.log(order);
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
        const storeList = await this.storesRepository.getStoreList();
        return storeList;
    };
    // 가게 정보 수정
    updateStoreInfo = async (storeId, aduserId, storeName, storeAddress, storeContact, storeContent, storeCategory) => {
        const store = await this.storesRepository.getStoreById(storeId);
        if (!store) {
            throw new Error("존재하지 않는 가게 입니다.");
        }
        if (store.aduserId !== aduserId) {
            throw new Error("본인 가게만 수정 가능합니다.");
        }
        await this.storesRepository.updateStoreInfo(storeId, aduserId, storeName, storeAddress, storeContact, storeContent, storeCategory);
    };
    // 가게 정보 삭제
    deleteStoreInfo = async (storeId, aduserId, password, hashedPassword) => {
        const deleteStoreId = await this.storesRepository.getStoreById(storeId);
        const youPwHashPw = await bcrypt.compare(password, hashedPassword);
        console.log("ddd");
        console.log(password, youPwHashPw);
        if (!youPwHashPw) {
            throw new NotFoundError("비밀번호가 일치하지 않습니다.");
        }
        if (deleteStoreId.aduserId !== aduserId) {
            throw new NotFoundError("본인 가게만 삭제 가능합니다.");
        }
        const store = await this.storesRepository.deleteStoreInfo(storeId, aduserId);
        return store;
    };
    findStore = async (search) => {
        const searchStore = await this.storesRepository.searchStore(search);
        //검색키워드를 포함한 메뉴를 가진 storeId 호출
        const searchMenu = await this.menusRepository.searchStoreByMenu(search);
        const storeIdList = searchMenu.map((menu) => +menu.storeId);
        //검색키워드를 포함한 메뉴를 가진 store의 정보들
        const searchStore2 = await this.storesRepository.searchStoreByMenuId(storeIdList);
        // if (!searchStore && !searchStore2) {
        //     throw new NotFoundError("검색키워드와 일치하는 가게가 없습니다.");
        // }
        //검색한 데이터를 평점 내림차순으로 정리해 searchData 변수에 저장
        const searchData = [...searchStore, ...searchStore2].sort((a, b) => b.rate - a.rate);
        if (searchData.length == 0) {
            throw new NotFoundError("검색키워드와 일치하는 가게가 없습니다.");
        }
        return searchData;
    };
}
