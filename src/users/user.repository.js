export class UsersRepository {
    constructor(prisma, redisClient) {
        this.prisma = prisma;
        this.redisClient = redisClient;
    }
    getUserByEmail = async (email) => {
        const user = await this.prisma.users.findFirst({ where: { email } });
        return user;
    };
}
