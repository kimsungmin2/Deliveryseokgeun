import { NotFoundError } from "../common.error.js";
import { ValidationError } from "../common.error.js";
import { UnauthorizedError } from "../common.error.js";
import { ConflictError } from "../common.error.js";
import { ForbiddenError } from "../common.error.js";

export class StoresController {
  constructor(storesService, ordersService) {
    this.storesService = storesService;
    this.ordersService = ordersService;
  }
  // 로그인
  signIn = async (req, res, next) => {
    const { adEmail, adPassword } = req.body;
    const tokens = await this.storesService.signIn(adEmail, adPassword);
    res.cookie("authorization", `Bearer ${tokens.storeJWT}`);
    res.cookie("refreshToken", tokens.refreshToken);
    return res.status(200).json({ message: "로그인 성공" });
  };
  // 가게정보 생성
  createStoreInfo = async (req, res, next) => {
    try {
    const { storeName, storeAddress, storeContact, storeContent, storeCategory } = req.body;
    const { aduserId } = req.user;
    if (!storeName) {
      return res.status(401).json({ message: "가게 이름을 입력하세요." });
    }
    if (!storeAddress) {
      return res.status(401).json({ message: "가게 주소를 입력하세요." });
    }
    if (!storeContact) {
      return res.status(401).json({ message: "가게 연락처를 입력하세요." });
    }
    if (!storeContent) {
      return res.status(401).json({ message: "가게 내용을 입력하세요." });
    }
    if (!storeCategory) {
      return res
        .status(401)
        .json({ message: "서비스하는 음식의 종류를 입력하세요." });
    }

    // 서비스로 아이디를 보내면서도 나중엔 가공된 데이터와 함께 돌려받음
    const storeInfo = await this.storesService.createStoreInfo(
      aduserId,
      storeName,
      storeAddress,
      storeContact,
      storeContent,
      storeCategory
    );

    // 한바퀴 돌아서 클라이언트에게 반환
    return res.status(201).json({ message: "업체 정보 등록 완료.", storeInfo });
  }catch(err) {
  next(err)
}
};

  // 가게 정보 상세조회
  getStoreById = async (req, res, next) => {
    try {
      const storeId = req.params.storeId;

      const detailStoreInfo = await this.storesService.getStoreById(storeId);

      return res.status(200).json({ detailStoreInfo });
    } catch (err) {
      next(err);
    }
  };

  // 가게 목록 조회
  getStoreList = async (req, res, next) => {
    const storeList = await this.storesService.getStoreList();
    return res.status(200).json({ storeList });
  };

  // 가게 정보 수정
  updateStoreInfo = async (req, res, next) => {
    try {
      const { storeId } = req.params;
      const { user } = req.user;
      const {
        storeName,
        storeAddress,
        storeContact,
        storeContent,
        storeCategory,
      } = req.body;
      if (!storeId) {
        return res
          .status(401)
          .json({ message: "가게 아이디는 필수값 입니다." });
      }
      if (!storeName) {
        return res.status(401).json({ message: "가게 이름은 필수값 입니다." });
      }
      if (!storeAddress) {
        return res.status(401).json({ message: "가게 주소는 필수값 입니다." });
      }
      if (!storeContact) {
        return res
          .status(401)
          .json({ message: "가게 연락처는 필수값 입니다." });
      }
      if (!storeContent) {
        return res.status(401).json({ message: "가게 내용은 필수값 입니다." });
      }
      if (!storeCategory) {
        return res
          .status(401)
          .json({ message: "서비스하는 음식의 종류는 필수값입니다." });
      }

      await this.storesService.updateStoreInfo(
        storeId,
        user,
        storeName,
        storeAddress,
        storeContact,
        storeContent,
        storeCategory
      );

      return res
        .status(201)
        .json({ message: "가게 정보 수정이 완료 되었습니다." });
    } catch (err) {
      if (err.message === "존재하지 않는 가게 입니다.") {
        return res.status(401).json({ message: err.message });
      }
      if (err.message === "본인 가게만 수정 가능합니다.") {
        return res.status(401).json({ message: err.message });
      }
      next(err);
    }
  };

  // 가게 정보 삭제
  deleteStoreInfo = async (req, res, next) => {
    try {
      const { storeId } = req.params;
      const hashedPassword = req.user.adPassword; // DB에서 가져온 해시된 비밀번호
      const { aduserId } = req.user;
      const { password } = req.body;
      // if (!aduserId) {
      //   throw new UnauthorizedError("권한이 없습니다.");
      // }

      const store = await this.storesService.getStoreById(storeId);
      console.log(store);
      if (!store) {
        throw new NotFoundError("삭제하려는 가게 정보가 존재하지 않습니다.");
      }
      const deleteStore = await this.storesService.deleteStoreInfo(
        storeId,
        aduserId,
        password,
        hashedPassword
      );

      return res.status(201).json({ message: "가게 정보가 삭제되었습니다." });
    } catch (err) {
      // if (err instanceof NotFoundError) {
      //   res.status(404).json({ message: err.message });
      // }
      next(err);
    }
  };

  readystatusup = async (req, res, next) => {
    try {
      const { storeId, orderId } = req.params;
      const { aduserId } = req.user;
      const { orderStatus = "deliveryReady" } = req.body;
      const store = await this.storesService.getStoreById(storeId);
      console.log(store.aduserId);
      if (aduserId !== store.aduserId)
        return res.status(401).json({ message: "권한이 없습니다." });

      const updatedOrder = await this.storesService.readystatusup(
        orderId,
        storeId,
        orderStatus
      );
      return res.status(200).json({ message: "배달이 준비중입니다." });
    } catch (err) {
      if (err.message === "해당 주문을 찾을 수 없습니다.") {
        return res.status(401).json({ message: err.message });
      }
      if (err.message === "주문 변경에 실패하였습니다.") {
        return res.status(403).json({ message: err.message });
      }
      next(err);
    }
  };

  ingstatusup = async (req, res, next) => {
    try {
      const { storeId, orderId } = req.params;
      const { aduserId } = req.user;
      const { orderStatus = "delivering" } = req.body;
      const store = await this.storesService.getStoreById(storeId);
      if (!store)
        return res.status(401).json({ message: "음식점을 찾지 못했습니다." });
      console.log(store.aduserId);
      if (aduserId !== store.aduserId)
        return res.status(401).json({ message: "권한이 없습니다." });

      const updatedOrder = await this.storesService.ingstatusup(
        orderId,
        storeId,
        orderStatus
      );
      return res.status(200).json({ message: "배달이 시작되었습니다." });
    } catch (err) {
      if (err.message === "해당 주문을 찾을 수 없습니다.") {
        return res.status(401).json({ message: err.message });
      }
      if (err.message === "주문 변경에 실패하였습니다.") {
        return res.status(403).json({ message: err.message });
      }
      next(err);
    }
  };

  completestatusup = async (req, res, next) => {
    try {
      const { storeId, orderId } = req.params;
      const { aduserId } = req.user;
      const { orderStatus = "deliveryCompleted" } = req.body;
      const store = await this.storesService.getStoreById(storeId);
      if (!store)
        return res.status(401).json({ message: "음식점을 찾지 못했습니다." });
      console.log(store.aduserId);
      if (aduserId !== store.aduserId)
        return res.status(401).json({ message: "권한이 없습니다." });

      const updatedOrder = await this.storesService.completestatusup(
        orderId,
        storeId,
        orderStatus
      );
      return res.status(200).json({ message: "배달이 완료되었습니다." });
    } catch (err) {
      if (err.message === "해당 주문을 찾을 수 없습니다.") {
        return res.status(401).json({ message: err.message });
      }
      if (err.message === "주문 변경에 실패하였습니다.") {
        return res.status(403).json({ message: err.message });
      }
      next(err);
    }
  };

  deleteOrder = async (req, res, next) => {
    try {
      const { storeId, orderId } = req.params;
      const { aduserId } = req.user;

      const store = await this.storesService.getStoreById(storeId);
      if (!store)
        return res.status(401).json({ message: "음식점을 찾지 못했습니다." });
      if (aduserId !== store.aduserId)
        return res.status(401).json({ message: "권한이 없습니다." });

      const deletedOrder = await this.storesService.deleteOrder(
        orderId,
        storeId
      );

      res.status(200).json({ message: "배달이 정상적으로 취소되었습니다." });
    } catch (err) {
      if (err.message === "해당 주문을 찾을 수 없습니다.") {
        return res.status(401).json({ message: err.message });
      }
      next(err);
    }
  };

  getOrderData = async (req, res, next) => {
    try {
      const { storeId } = req.params;
      const { adusrId } = req.user;

      // const store = await this.ordersService.findStoreId(storeId);

      // if (userId !== store.aduserId) {
      //   return res
      //     .status(403)
      //     .json({ message: "사장님만 주문 조회를 할 수 있습니다." });
      // }

      const order = await this.storesService.getOrderdata(storeId);
      return res.status(200).json({ data: order });
    } catch (err) {
      if (err instanceof NotFoundError) {
        res.status(404).json({ message: err.message });
      }
      next(err);
    }
  };

  searchData = async (req, res, next) => {
    try {
      const { search } = req.body;

      if (!search) {
        return res.status(400).json({ message: "검색어를 입력해주세요" });
      }
    } catch (err) {
      next(err);
    }
  };
  
  // 가게 정보 상세조회
  getStoreById = async (req, res, next) => {
    try {
      const storeId = req.params.storeId;

      const detailStoreInfo = await this.storesService.getStoreById(storeId);

      return res.status(200).json({ detailStoreInfo });
    } catch (err) {
      if (err.message === "존재하지 않는 상점입니다.") {
        return res.status(401).json({ message: err.message });
      }
      next(err);
    }
  };
  // 가게 목록 조회
  getStoreList = async (req, res, next) => {
    const storeList = await this.storesService.getStoreList();
    return res.status(200).json({ storeList });
  };
  // 가게 정보 수정
  updateStoreInfo = async (req, res, next) => {
    try {
      const { storeId } = req.params;
      const { user } = req.user;
      const {
        storeName,
        storeAddress,
        storeContact,
        storeContent,
        storeCategory,
      } = req.body;
      if (!storeId) {
        return res
          .status(401)
          .json({ message: "가게 아이디는 필수값 입니다." });
      }
      if (!storeName) {
        return res.status(401).json({ message: "가게 이름은 필수값 입니다." });
      }
      if (!storeAddress) {
        return res.status(401).json({ message: "가게 주소는 필수값 입니다." });
      }
      if (!storeContact) {
        return res
          .status(401)
          .json({ message: "가게 연락처는 필수값 입니다." });
      }
      if (!storeContent) {
        return res.status(401).json({ message: "가게 내용은 필수값 입니다." });
      }
      if (!storeCategory) {
        return res
          .status(401)
          .json({ message: "서비스하는 음식의 종류는 필수값입니다." });
      }

      await this.storesService.updateStoreInfo(
        storeId,
        user,
        storeName,
        storeAddress,
        storeContact,
        storeContent,
        storeCategory
      );

      return res
        .status(201)
        .json({ message: "가게 정보 수정이 완료 되었습니다." });
    } catch (err) {
      if (err.message === "존재하지 않는 가게 입니다.") {
        return res.status(401).json({ message: err.message });
      }
      if (err.message === "본인 가게만 수정 가능합니다.") {
        return res.status(401).json({ message: err.message });
      }
      next(err);
    }
  };
  // 가게 정보 삭제
  deleteStoreInfo = async (req, res, next) => {
    try {
      const { storeId } = req.params;
      const hashedPassword = req.user.adPassword; // DB에서 가져온 해시된 비밀번호
      const { aduserId } = req.user;
      const { password } = req.body;

      const store = await this.storesService.getStoreById(storeId);
      console.log(store);
      if (!store) {
        throw new NotFoundError("삭제하려는 가게 정보가 존재하지 않습니다.");
      }
      const deleteStore = await this.storesService.deleteStoreInfo(
        storeId,
        aduserId,
        password,
        hashedPassword
      );
      return res.status(201).json({ message: "가게 정보가 삭제되었습니다." });
    } catch (err) {
      next(err);
    }
  };
  readystatusup = async (req, res, next) => {
    try {
      const { storeId, orderId } = req.params;
      const { aduserId } = req.user;
      const { orderStatus = "deliveryReady" } = req.body;
      const store = await this.storesService.getStoreById(storeId);
      console.log(store.aduserId);
      if (aduserId !== store.aduserId)
        return res.status(401).json({ message: "권한이 없습니다." });

      const updatedOrder = await this.storesService.readystatusup(
        orderId,
        storeId,
        orderStatus
      );
      return res.status(200).json({ message: "배달이 준비중입니다." });
    } catch (err) {
      if (err.message === "해당 주문을 찾을 수 없습니다.") {
        return res.status(401).json({ message: err.message });
      }
      if (err.message === "주문 변경에 실패하였습니다.") {
        return res.status(403).json({ message: err.message });
      }
      next(err);
    }
  };
  ingstatusup = async (req, res, next) => {
    try {
      const { storeId, orderId } = req.params;
      const { aduserId } = req.user;
      const { orderStatus = "delivering" } = req.body;
      const store = await this.storesService.getStoreById(storeId);
      if (!store)
        return res.status(401).json({ message: "음식점을 찾지 못했습니다." });
      console.log(store.aduserId);
      if (aduserId !== store.aduserId)
        return res.status(401).json({ message: "권한이 없습니다." });

      const updatedOrder = await this.storesService.ingstatusup(
        orderId,
        storeId,
        orderStatus
      );
      return res.status(200).json({ message: "배달이 시작되었습니다." });
    } catch (err) {
      if (err.message === "해당 주문을 찾을 수 없습니다.") {
        return res.status(401).json({ message: err.message });
      }
      if (err.message === "주문 변경에 실패하였습니다.") {
        return res.status(403).json({ message: err.message });
      }
      next(err);
    }
  };
  completestatusup = async (req, res, next) => {
    try {
      const { storeId, orderId } = req.params;
      const { aduserId } = req.user;
      const { orderStatus = "deliveryCompleted" } = req.body;
      const store = await this.storesService.getStoreById(storeId);
      if (!store)
        return res.status(401).json({ message: "음식점을 찾지 못했습니다." });
      console.log(store.aduserId);
      if (aduserId !== store.aduserId)
        return res.status(401).json({ message: "권한이 없습니다." });

      const updatedOrder = await this.storesService.completestatusup(
        orderId,
        storeId,
        orderStatus
      );
      return res.status(200).json({ message: "배달이 완료되었습니다." });
    } catch (err) {
      if (err.message === "해당 주문을 찾을 수 없습니다.") {
        return res.status(401).json({ message: err.message });
      }
      if (err.message === "주문 변경에 실패하였습니다.") {
        return res.status(403).json({ message: err.message });
      }
      next(err);
    }
  };
  deleteOrder = async (req, res, next) => {
    try {
      const { storeId, orderId } = req.params;
      const { aduserId } = req.user;

      const store = await this.storesService.getStoreById(storeId);
      if (!store)
        return res.status(401).json({ message: "음식점을 찾지 못했습니다." });
      if (aduserId !== store.aduserId)
        return res.status(401).json({ message: "권한이 없습니다." });

      const deletedOrder = await this.storesService.deleteOrder(
        orderId,
        storeId
      );

      res.status(200).json({ message: "배달이 정상적으로 취소되었습니다." });
    } catch (err) {
      if (err.message === "해당 주문을 찾을 수 없습니다.") {
        return res.status(401).json({ message: err.message });
      }
      next(err);
    }
  };
  getOrderData = async (req, res, next) => {
    try {
      const { storeId } = req.params;
      const { adusrId } = req.user;

      // const store = await this.ordersService.findStoreId(storeId);

      // if (userId !== store.aduserId) {
      //   return res
      //     .status(403)
      //     .json({ message: "사장님만 주문 조회를 할 수 있습니다." });
      // }

      const order = await this.storesService.getOrderdata(storeId);
      return res.status(200).json({ data: order });
    } catch (err) {
      if (err instanceof NotFoundError) {
        res.status(404).json({ message: err.message });
      }
      next(err);
    }
  };

  searchData = async (req, res, next) => {
    try {
      const { search } = req.body;

      if (!search) {
        return res.status(400).json({ message: "검색어를 입력해주세요" });
      }

      //검색키워드를 storeName에 포함한 가게들의 정보
      const searchData = await this.storesService.findStore(search);

      return res.status(200).json({ data: searchData });
    } catch (err) {
      next(err);
    }
  };
}
