export class UsersRepository {
    constructor(prisma, redisClient) {
        this.prisma = prisma;
        this.redisClient = redisClient;
    }

    getUserByEmail = async (email) => {
        const user = await this.prisma.users.findFirst({ where: { email } });
        return user;
    };

    getAdByEmails = async (adEmail) => {
        const adusers = await this.prisma.aduser.findFirst({ where: { adEmail } });

        return adusers;
    };

    // 유저 회원가입
    registercreate = async (email, name, hashedPassword, token) => {
        const user = await this.prisma.users.create({
            data: { email, name, password: hashedPassword, verifiCationToken: token },
        });

        return user;
    };

    // 사장 회원가입
    adregistercreate = async (adEmail, adminName, aduserhashPassword, token) => {
        const aduser = await this.prisma.aduser.create({
            data: { adEmail, adminName, adPassword: aduserhashPassword, adVerifiCationToken: token },
        });

        return aduser;
    };

    useridedit = async (userId) => {
        const update = await this.prisma.users.update({
            where: {
                userId: +userId,
            },
            data: {
                emailStatus: "completion",
            },
        });
        return update;
    };
}
