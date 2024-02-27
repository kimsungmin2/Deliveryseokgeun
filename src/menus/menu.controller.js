export class MenusController {
    constructor(menusService, storesService) {
        this.menusService = menusService;
        this.storesService = storesService;
    }

    // 메뉴 작성
    createMenu = async (req, res, next) => {
        try {
            const { storeId } = req.params;
            const { aduserId } = req.user;
            const { menuName, menuPrice, menuContent, quantity } = req.body;
            const store = await this.storesService.getStoreById(storeId);
            if (!store.aduserId !== aduserId) {
                return res.status(401).json({ message: "메뉴 생성 권한이 없습니다." });
            }
            const createMenu = await this.menusService.createMenu(storeId, aduserId, menuName, menuPrice, menuContent, quantity);

            return res.status(201).json({ message: "메뉴 등록에 성공하였습니다" });
        } catch (err) {
            next(err);
        }
    };

    // 메뉴 수정
    updateMenu = async (req, res, next) => {
        try {
            const { storeId, menuId } = req.params;
            const { aduserId } = req.user;
            const { menuName, menuPrice, menuContent, quantity } = req.body;

            const store = await this.storesService.getStoreById(storeId);

            if (store.aduserId !== aduserId) {
                return res.status(403).json({ message: "수정 권한이 없습니다." });
            }
            const updateMenu = await this.menusService.updateMenu(menuId, menuName, menuPrice, menuContent, quantity);
            return res.status(200).json(updateMenu);
        } catch (err) {
            next(err);
        }
    };

    // 메뉴 삭제
    deleteMenu = async (req, res, next) => {
        try {
            const { storeId, menuId } = req.params;
            const { aduserId } = req.user;
            const store = await this.storesService.getStoreById(storeId);

            if (store.aduserId !== aduserId) {
                return res.status(403).json({ message: "삭제 권한이 없습니다." });
            }
            const deleteMenu = await this.menusService.deleteMenu(menuId, aduserId);
            return res.status(200).json({ message: "삭제 완료!" });
        } catch (err) {
            next(err);
        }
    };

    // ----------------------------------------------------------------------------------------------------------------

    // 가게 메뉴 조회
    getStoreById = async (req, res, next) => {
        try {
            const { storeId } = req.params;
            const { aduserId } = req.user;
            const menu = await this.menusService.getStoreById(storeId, aduserId);
            return res.status(200).json({ data: menu });
        } catch (err) {
            next(err);
        }
    };
}
