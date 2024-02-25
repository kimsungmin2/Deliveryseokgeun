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

    createStoreInfo = async (storeName, storeAddress, storeContact, storeContent, aduserId) => {
        const storeInfo = await this.storesRepository.createStoreInfo(storeName, storeAddress, storeContact, storeContent, aduserId)
        return storeInfo
    }

    getStoreInfo = async (storeId) => {
        const detailStoreInfo = await this.storesRepository.getStoreInfo(storeId)
        if (!detailStoreInfo) {
            throw new Error ("등록된 가게가 없습니다.");
        }
        return detailStoreInfo
    }

    getStoreList = async () => {
        const storeList = await this.storesRepository.getStoreList()
        return storeList
    }

    updateStoreInfo = async (storeId, user, storeName, storeAddress, storeContact, storeContent) => {
        const store = await this.storesRepository.updateStoreInfo(storeName, storeAddress, storeContact, storeContent,storeId)
        if (!store) {
            return ("존재하지 않는 가게 입니다.")
        }
        if (store.userId !== user) {
            return ("본인 가게만 수정 가능합니다.")
        }
    }

    deleteStoreInfo = async (storeId, aduserId) => {
        const store = await this.storesRepository.deleteStoreInfo(storeId, aduserId);
        return store;
    };
}
