import { StoreCategory } from "@prisma/client";
import { Store } from "express-session";

export class StoresRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
  getStoreByEmail = async (adEmail) => {
    const store = await this.prisma.aduser.findFirst({ where: { adEmail } });
    return store;
  };
  // 가게 정보 생성
  createStoreInfo = async (
    aduserId,
    storeName,
    storeAddress,
    storeContact,
    storeContent,
    storeCategory,
    storeRate
  ) => {
    const storeInfo = await this.prisma.stores.create({
      data: {
        aduserId: +aduserId,
        storeName,
        storeAddress,
        storeContact,
        storeContent,
        storeCategory : "KoreanFood",
        storeRate : 5
      },
    });
    return storeInfo;
  };
  // 가게 정보 상세조회
  getStoreInfo = async (storeId) => {
    const detailStoreInfo = await this.prisma.stores.findFirst({
      where: {
        storeId: +storeId,
      },
      select: {
        storeId: true,
        storeName: true,
        storeAddress: true,
        storeContact: true,
        storeContent: true,
        storeCategory : true,
        storeRate : true,
      },
    });
    return detailStoreInfo;
  };
  // 가게 목록 조회
  getStoreList = async () => {
    const storeList = await this.prisma.stores.findMany({
      select: {
        storeId : true,
        storeName : true,
        storeAddress : true,
        storeContact : true,
        storeCategory : true,
        storeRate : true
      },
    });
    return storeList;
  };
  // 가게 정보 수정
  updateStoreInfo = async (
    storeId,
    storeName,
    storeAddress,
    storeContact,
    storeContent,
    storeCategory
  ) => {
    const store = await this.prisma.stores.findFirst({
      where: {
        storeId: +storeId,
      },
    });
    await this.prisma.stores.update({
      where: {
        storeId: +storeId,
      },
      data: {
        storeName,
        storeAddress,
        storeContact,
        storeContent,
        storeCategory : "KoreanFood"
      },
    });
    return store;
  };
  // 가게 정보 삭제
  deleteStoreInfo = async (storeId, aduserId) => {
    const store = await this.prisma.stores.delete({
        where: {
            storeId: +storeId,
            aduserId: +aduserId,
        },
    });
    return store;
};
}
