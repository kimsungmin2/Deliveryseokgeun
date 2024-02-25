export class StoresController {
  constructor(storesService) {
    this.storesService = storesService;
  }
  signIn = async (req, res, next) => {
    const { adEmail, adPassword } = req.body;

    const tokens = await this.storesService.signIn(adEmail, adPassword);
    res.cookie("authorization", `Bearer ${tokens.storeJWT}`);
    res.cookie("refreshToken", tokens.refreshToken);
    return res.status(200).json({ message: "로그인 성공" });
  };

  createStoreInfo = async (req, res, next) => {
    const { storeName, storeAddress, storeContact, storeContent } = req.body;
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
    // 서비스로 아이디를 보내면서도 나중엔 가공된 데이터와 함께 돌려받음
    const storeInfo = await this.storesService.createStoreInfo( storeName, storeAddress, storeContact, storeContent, aduserId )

    // 한바퀴 돌아서 클라이언트에게 반환
    return res.status(201).json({ message : "업체 정보 등록 완료.", storeInfo })
  };

  getStoreInfo = async (req, res, next) => {
    try{
    const storeId = req.params.storeId

    const detailStoreInfo = await this.storesService.getStoreInfo(storeId)

    return res.status(200).json ({ detailStoreInfo })
    }catch(err){
      if (err.message === "등록된 가게가 없습니다."){
        return res.status(401).json({ message : err.message })
      }
      next(err)
    }
  }

  getStoreList = async (req, res, next) => {
    const storeList = await this.storesService.getStoreList()
    return res.status(200).json ({ storeList })
  }

  updateStoreInfo = async (req, res, next) => {
    const { storeId } = req.params
    const { user } = req.user
    const { storeName, storeAddress, storeContact, storeContent } = req.body
    if (!storeId) {
        return res.status(401).json ({ message : "가게 아이디는 필수값 입니다." })
      }
    if (!storeName) {
        return res.status(401).json ({ message : "가게 이름은 필수값 입니다." })
      }
    if (!storeAddress) {
        return res.status(401).json ({ message : "가게 주소는 필수값 입니다." })
    }
    if (!storeContact) {
        return res.status(401).json ({ message : "가게 연락처는 필수값 입니다." })
    }
    if (!storeContent) {
        return res.status(401).json ({ message : "가게 내용은 필수값 입니다." })
    }

    await this.storesService.updateStoreInfo(storeId, user, storeName, storeAddress, storeContact, storeContent)

    return res.status(201).json({ message : "가게 정보 수정이 완료 되었습니다." })
  }

  deleteStoreInfo = async (req, res, next) => {
    try {
        const  storId  = req.params.storeId
        const { aduserId } = req.user;
        const { password } = req.body;
        if (!aduserId) {
            return res.status(401).json({ message: "권한이 없습니다." });
        }
        if (password !== req.user.adPassword) {
            return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
        }
        const store = await this.storesService.deleteStoreInfo(storId, aduserId);
        
        return res.status(201).json({ message: "가게 정보가 삭제되었습니다." });
    } catch (err) {
        next(err);
    }
};
}
