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
