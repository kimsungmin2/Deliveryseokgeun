import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from 'bcrypt';

dotenv.config();
export class UsersService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    signIn = async (email, password) => {
        const user = await this.usersRepository.getUserByEmail(email);

        const userJWT = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: "12h" });
        const refreshToken = jwt.sign({ userId: user.userId }, process.env.REFRESH_SECRET, { expiresIn: "7d" });

        return userJWT, refreshToken;
    };

    hashPassword = async (password) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
};

userregister = async ( email, name, password, passwordconfirm ) => {
    const user = await this.usersRepository.getUserByEmail(email);
    if (user) {
        throw new Error('이미 등록된 이메일입니다.');
    }
    const hashedPassword = await this.hashPassword(password);
    const usercreate = await this.usersRepository.registerucreate(
        email, name, hashedPassword, 
    );
    return user, usercreate;
}


aduserhashPassword = async (adPassword) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(adPassword, saltRounds);
    return hashedPassword;
};


    adminregister = async (adEmail, adminName, adPassword, adPasswordconfirm) => {
        const aduser = await this.usersRepository.adByEmails(adEmail); 
        console.log(aduser);

        if (aduser) {
            throw new Error('이미 등록된 이메일입니다.');
        }
        
        const hashedPassword = await this.aduserhashPassword(adPassword);

        const adusercreate = await this.usersRepository.registeracreate(
            adEmail, adminName, hashedPassword
        );

        return aduser, adusercreate;
    }
}
