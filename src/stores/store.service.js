import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
export class StoresService {
    constructor(storesRepository) {
        this.storesRepository = storesRepository;
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
    getStoreInfo = async (storeId) => {
        const detailStoreInfo = await this.storesRepository.getStoreInfo(storeId)
        if (!detailStoreInfo) {
            throw new Error ("등록된 가게가 없습니다.");
        }
        return detailStoreInfo
    }
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
