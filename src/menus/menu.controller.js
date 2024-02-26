export class MenusController {
    constructor(menusService) {
        this.menusService = menusService;
    }

    // 메뉴 작성
    createMenu = async(req, res, next) => {
        try {
            const { storeId } = req.params 
            const { menuName, menuPrice, menuContent, quantity } = req.body
            const createMenu = await this.menusService.createMenu(storeId, menuName, menuPrice, menuContent, quantity)

            return res.status(201).json({ message: "메뉴 등록에 성공하였습니다" });
        } catch(err) {
            next (err)
        }
    }

    // 메뉴 수정
    updateMenu = async (req, res, next) => {
        try {
          const { menuId } = req.params
          const { menuName, menuPrice, menuContent, quantity } = req.body;
          const menu = await this.menusService.getMenuById(menuId);
          const updateMenu = await this.menusService.updateMenu(menuId,menuName, menuPrice, menuContent, quantity);
          return res.status(200).json(updateMenu);
        } catch (err) {
          next(err);
        }
      };

    // 메뉴 삭제
    deleteMenu = async(req, res, next) => {
        try {
            const { menuId } = req.params
            const menu = await this.menusService.getMenuById(menuId);
            const deleteMenu = await this.menusService.deleteMenu(menuId);
            return res.status(200).json({ message: "삭제 완료!"});
        } catch(err) {
            next(err);
        }
    }

    // ----------------------------------------------------------------------------------------------------------------

    
    // 가게 메뉴 조회
    getStoreById = async(req, res, next) => {
        try{
            const { storeId } = req.params
            const menu = await this.menusService.getStoreById(storeId)
            return res.status(200).json({ data: menu })
        } catch(err) {
            next(err)
        }
    }
}
