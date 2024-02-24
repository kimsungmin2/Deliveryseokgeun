export class UsersRepository {
    constructor(prisma, redisClient) {
        this.prisma = prisma;
        this.redisClient = redisClient;
    }

    getUserByEmail = async (email) => {
        const user = await this.prisma.users.findFirst({ where: { email } });
        console.log(user);
        return user;
    };

    adByEmails = async (adEmail) => {
        // const ddd = await this.prisma.Aduser.findFirst({ where : {adEmail}});
        // console.log(adEmail);
        const adusers = await this.prisma.aduser.findFirst({ where : { adEmail } });
        console.log(adusers);

        return adusers;
    }

    registerucreate = async (email, name, hashedPassword) => {
        const user = await this.prisma.users.create({
            data: { email, name, password : hashedPassword },
          });

          return user;
    }

    registeracreate = async (adEmail, adminName, aduserhashPassword) => {

        const aduser = await this.prisma.aduser.create({
            data :{ adEmail, adminName, adPassword : aduserhashPassword }     
        });

        return aduser;
    }

    
}
