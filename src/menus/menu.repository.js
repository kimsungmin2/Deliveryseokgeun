export class MenusRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    getMenuById = async (menuId) => {
        const menu = await this.prisma.menus.findFirst({
            where: { menuId: +menuId },
        });
        return menu;
    };
}
