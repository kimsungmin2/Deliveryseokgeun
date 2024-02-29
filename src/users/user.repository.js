export class UsersRepository {
    constructor(prisma, redisClient) {
        this.prisma = prisma;
        this.redisClient = redisClient;
    }
    aduseraceess = async (aduserId, adEmailStatus, adVerifiCationToken) => {
        const aduser = await this.prisma.aduser.update({
            where: { aduserId: +aduserId },
            data: {
                adEmailStatus,
                adVerifiCationToken,
            },
        });
        return aduser;
    };
    getUserByEmail = async (email) => {
        const user = await this.prisma.users.findFirst({ where: { email } });

        return user;
    };
    getAdByEmails = async (adEmail) => {
        const adusers = await this.prisma.aduser.findFirst({ where: { adEmail } });

        return adusers;
    };

    userById = async (userId) => {
        const user = await this.prisma.users.findFirst({
            where: { userId: +userId },
        });

        return user;
    };

    aduserById = async (aduserId) => {
        const user = await this.prisma.aduser.findFirst({
            where: { aduserId: +aduserId },
        });
        return user;
    };

    getUserById = async (userId) => {
        const user = await this.prisma.users.findFirst({
            where: { userId: +userId },
            select: {
                userId: true,
                email: true,
                name: true,
                emailStatus: true,
                emailVerified: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return user;
    };

    getUsermany = async () => {
        const aduser = await this.prisma.users.findMany({
            select: {
                userId: true,
                email: true,
                name: true,
                emailStatus: true,
                emailVerified: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return aduser;
    };

    getadUserById = async (aduserId) => {
        const aduser = await this.prisma.aduser.findFirst({
            where: { aduserId: +aduserId },
            select: {
                aduserId: true,
                adEmail: true,
                adminName: true,
                adEmailStatus: true,
                adEmailVerified: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return aduser;
    };

    getadmin = async () => {
        const aduser = await this.prisma.aduser.findMany({
            select: {
                aduserId: true,
                adEmail: true,
                adminName: true,
                adEmailStatus: true,
                adEmailVerified: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return aduser;
    };

    userEdit = async (userId, name) => {
        await this.prisma.users.update({
            where: { userId: +userId },
            data: {
                name,
            },
        });
    };

    aduserEdit = async (aduserId, adminName) => {
        console.log(adminName);
        await this.prisma.aduser.update({
            where: { aduserId: +aduserId },
            data: {
                adminName,
            },
        });
    };

    userdelete = async (userId) => {
        await this.prisma.users.delete({
            where: { userId: +userId },
        });
    };

    aduserdelete = async (aduserId) => {
        await this.prisma.aduser.delete({
            where: { aduserId: +aduserId },
        });
    };

    // 유저 회원가입
    registercreate = async (email, name, hashedPassword, token) => {
        const user = await this.prisma.users.create({
            data: {
                email,
                name,
                password: hashedPassword,
                verifiCationToken: token,
                rating: "basic",
            },
        });
        return user;
    };
    // 사장 회원가입
    adregistercreate = async (adEmail, adminName, aduserhashPassword, token) => {
        const aduser = await this.prisma.aduser.create({
            data: {
                adEmail,
                adminName,
                adPassword: aduserhashPassword,
                adVerifiCationToken: token,
            },
        });
        return aduser;
    };

    useraccess = async (userId) => {
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

    ratingrareUpdate = async (userId) => {
        const update = await this.prisma.users.update({
            where: {
                userId: +userId,
            },
            data: {
                rating: "rare",
            },
        });
        return update;
    };

    ratingepicUpdate = async (userId) => {
        const update = await this.prisma.users.update({
            where: {
                userId: +userId,
            },
            data: {
                rating: "epic",
            },
        });
        return update;
    };
}
