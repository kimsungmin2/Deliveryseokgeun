export class MenusRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  // 메뉴 작성
  createMenu = async (storeId, menuName, menuPrice, menuContent, quantity) => {
    const menu = await this.prisma.menus.create({
      data: {
        storeId: +storeId,
        menuName,
        menuPrice,
        menuContent,
        quantity: +quantity,
      },
    });

    return menu;
  };

  // 메뉴 수정
  updateMenu = async (menuId, menuName, menuPrice, menuContent, quantity) => {
    const updateMenu = await this.prisma.menus.update({
      where: { menuId: +menuId },
      data: { menuName, menuPrice, menuContent, quantity },
    });
    return updateMenu;
  };

  // 메뉴 삭제
  deleteMenu = async (menuId) => {
    const deleteMenu = await this.prisma.menus.delete({
      where: {
        menuId: +menuId,
      },
    });

    return deleteMenu;
  };

  // ----------------------------------------------------------------------------------------------------------------

  // 메뉴 조회
  getMenuById = async (menuId) => {
    const getmenu = await this.prisma.menus.findFirst({
      where: { menuId: +menuId },
    });

    return getmenu;
  };

  // 가게 메뉴 조회
  getStoreById = async (storeId) => {
    const getstore = await this.prisma.menus.findMany({
      where: { storeId: +storeId },
    });

    return getstore;
  };
}
