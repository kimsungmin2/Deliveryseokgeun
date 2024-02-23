export class UsersRepository {
    constructor(prisma, redisClient) {
        this.prisma = prisma;
        this.redisClient = redisClient;
    }

    getUserByEmail = async (email) => {
        const user = await this.prisma.users.findFirst({ where: { email } });
        return user;
    };

    adByEmails = async (adEmail) => {
        const store = await this.prisma.findFirst({ where : { adEmail } });

        return store;
    }

    registerucreate = async (email, password, passwordconfirm, name) => {
        const user = await this.prisma.user.create({
            data: { email, name, password },
          });

          return user;
    }

    registeracreate = async (adEmail, adminName, adPassword, adPasswordconfirm) => {

        const aduser = await this.prisma.Stores.create({
            adEmail, adminName, adPassword 
        });

        return aduser;
    }
}
