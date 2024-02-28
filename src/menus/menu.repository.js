export class MenusRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }

    // 메뉴 작성
    createMenu = async (storeId, menuName, menuPrice, menuContent, quantity, imageUrl) => {
        const menu = await this.prisma.menus.create({
            data: {
                storeId: +storeId,
                menuName,
                menuPrice: +menuPrice,
                menuContent,
                quantity: +quantity,
                menuImage: imageUrl,
            },
        });
        return menu;
    };
    searchStoreByMenu = async (search) => {
        const searchByMenu = await this.prisma.menus.findMany({
            where: {
                menuName: {
                    contains: search,
                },
            },
            select: {
                storeId: true,
            },
        });
        return searchByMenu;
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
    findStoreBymenuId = async (menuId) => {
        const store = await this.prisma.menus.findFirst({
            where: { menuId: +menuId },
            select: {
                store: {
                    select: {
                        storeId: true,
                        storeName: true,
                    },
                },
            },
        });
        return store;
    };
    // 메뉴 조회
    getMenuById = async (menuId) => {
        const menu = await this.prisma.menus.findFirst({
            where: { menuId: +menuId },
        });
        return menu;
    };

    // 가게 메뉴 조회
    getStoreById = async (storeId) => {
        const getstore = await this.prisma.menus.findMany({
            where: { storeId: +storeId },
        });

        return getstore;
    };
    decrementquantity = async (menuId, quantity) => {
        const user = await this.prisma.menus.update({
            where: { menuId: +menuId },
            data: {
                quantity: {
                    decrement: +quantity,
                },
            },
        });

        return user;
    };
    incrementquantity = async (menuId, quantity) => {
        const user = await this.prisma.menus.update({
            where: { menuId: +menuId },
            data: {
                quantity: {
                    increment: +quantity,
                },
            },
        });

        return user;
    };
}
