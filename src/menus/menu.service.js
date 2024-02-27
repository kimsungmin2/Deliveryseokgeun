export class MenusService {
    constructor(menusRepository) {
        this.menusRepository = menusRepository;
    }

    // 메뉴 작성
    createMenu = async (storeId, menuName, menuPrice, menuContent, quantity, imageUrl) => {
        const menu = await this.menusRepository.createMenu(storeId, menuName, menuPrice, menuContent, quantity, imageUrl);

        return menu;
    };
    findStoreByMenuId = async (menuId) => {
        const store = await this.menusRepository.findStoreBymenuId(menuId);

        if (!store) {
            throw new NotFoundError("해당하는 가게가 존재하지 않습니다.");
        }
        return store;
    };

    // 메뉴 수정
    updateMenu = async (menuId, menuName, menuPrice, menuContent, quantity) => {
        const menu = await this.menusRepository.getMenuById(menuId);

        const updateMenu = await this.menusRepository.updateMenu(menuId, menuName, menuPrice, menuContent, quantity);
        return updateMenu;
    };

    // 메뉴 삭제
    deleteMenu = async (menuId) => {
        const menu = await this.menusRepository.getMenuById(menuId);
        if (!menu) {
            throw new Error("해당 메뉴를 찾을 수 없습니다.");
        }

        const deleteMenu = await this.menusRepository.deleteMenu(menuId);
        return { message: "해당 메뉴를 삭제하였습니다." };
    };

    // 메뉴 조회
    getMenuById = async (menuId) => {
        const menu = await this.menusRepository.getMenuById(menuId);
        if (!menu) {
            throw new Error("해당 메뉴를 찾을 수 없습니다.");
        }

        return menu;
    };

    // 가게 메뉴 조회
    getStoreById = async (storeId) => {
        const menu = await this.menusRepository.getStoreById(storeId);
        if (!menu) {
            throw new Error("해당 메뉴를 찾을 수 없습니다.");
        }

        return menu;
    };
}
