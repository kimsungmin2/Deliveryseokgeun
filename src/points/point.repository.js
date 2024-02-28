export class PointsRepository {

    constructor(prisma, redisClient) {
        this.prisma = prisma;
        this.redisClient = redisClient;
    }
    getUserPoint = async (userId) => {
        const point = await this.prisma.userpoints.groupBy({
            by: ["userId"],
            where: { userId: +userId },
            _sum: {
                possession: true,
            },
        });

        return point;
    };
    createPoint = async (userId) => {
        const point = await this.prisma.userpoints.create({ data: { userId: +userId, possession: 1000000, history: "가입 축하 포인트" } });
        return point;
    };
    quizPoint = async (userId, possession, history) => {
        const point = await this.prisma.userpoints.create({ data: { userId: +userId, possession: possession, history: history } });
    };

    userdecrementPoint = (userId, possession, history) => {
        const user = this.prisma.userpoints.create({
            data: {
                userId: +userId,
                possession: +possession,
                history: history,
            },
        });

        return user;
    };

    storedecrementPoint = (storeId, possession, history) => {
        const user = this.prisma.storepoints.create({
            data: {
                storeId: +storeId,
                possession: +possession,
                history: history,
            },
        });

        return user;
    };
}
