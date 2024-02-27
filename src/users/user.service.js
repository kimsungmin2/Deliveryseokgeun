import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "../middlewares/sendEmail.middlewares.js";
dotenv.config();
export class UsersService {
    constructor(usersRepository, pointsRepository, ordersRepository) {
        this.usersRepository = usersRepository;
        this.pointsRepository = pointsRepository;
        this.ordersRepository = ordersRepository;
    }
    signIn = async (email) => {
        const user = await this.usersRepository.getUserByEmail(email);
        const rating = await this.ordersRepository.ratingUserPoint(user.userId);
        const userpoint = rating[0]._sum.totalPrice;

        if (userpoint > 1000000) {
            await this.usersRepository.ratingepicUpdate(user.userId);
        } else if (userpoint > 500000) {
            await this.usersRepository.ratingrareUpdate(user.userId);
        }

        const userJWT = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, {
            expiresIn: "12h",
        });

        const refreshToken = jwt.sign({ userId: user.userId }, process.env.REFRESH_SECRET, { expiresIn: "7d" });
        console.log(userJWT);
        return { userJWT, refreshToken };
    };

    adsignIn = async (adEmail, adPassword) => {
        const aduser = await this.usersRepository.adByEmails(adEmail);

        if (!aduser) {
            throw new Error("유효하지 않은 이메일입니다.");
        }

        const userJWT = jwt.sign({ aduserId: aduser.aduserId }, process.env.JWT_SECRET, {
            expiresIn: "12h",
        });
        console.log(userJWT);
        const refreshToken = jwt.sign({ aduserId: aduser.aduserId }, process.env.REFRESH_SECRET, { expiresIn: "7d" });
        return { userJWT, refreshToken };
    };

    hashPassword = async (password) => {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    };
    /// 고객님 회원가입
    register = async (email, name, password, rating) => {
        const user = await this.usersRepository.getUserByEmail(email);
        if (user) {
            throw new Error("이미 등록된 이메일입니다.");
        }
        const hashedPassword = await this.hashPassword(password);
        const randomNum = () => {
            return Math.floor(1000 + Math.random() * 9000);
        };

        const token = randomNum();
        const usercreate = await this.usersRepository.registercreate(email, name, hashedPassword, token, rating);
        await sendVerificationEmail(email, token);
        return usercreate;
    };
    adhashPassword = async (adPassword) => {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(adPassword, saltRounds);
        return hashedPassword;
    };
    /// 사장님 회원가입   //에러
    adregister = async (adEmail, adminName, adPassword) => {
        const aduser = await this.usersRepository.adByEmails(adEmail);
        if (aduser) {
            throw new Error("이미 등록된 이메일입니다.");
        }
        const hashedPassword = await this.adhashPassword(adPassword);
        const randomNum = () => {
            return Math.floor(1000 + Math.random() * 9000);
        };
        const token = randomNum();
        const adusercreate = await this.usersRepository.adregistercreate(adEmail, adminName, hashedPassword, token);
        await sendVerificationEmail(adEmail, token);
        return adusercreate;
    };
    getUser = async (userId) => {
        const users = await this.usersRepository.getUserById(userId);
        if (users === null) {
            throw new Error("조회하시는 유저가 존재하지 않습니다.");
        }
        return users;
    };
    getUsermany = async () => {
        const users = await this.usersRepository.getUsermany();
        return users;
    };
    getadUser = async (aduserId) => {
        const adusers = await this.usersRepository.getadUserById(aduserId);
        if (adusers === null) {
            throw new Error("조회하시는 유저가 존재하지 않습니다.");
        }
        return adusers;
    };
    getadUsermany = async () => {
        const adusers = await this.usersRepository.adgetUsermany();
        return adusers;
    };
    userEdit = async (userId, email, password, name) => {
        const user = await this.usersRepository.userById(userId);
        if (!user) {
            throw new Error("유저가 존재하지 않습니다");
        }

        if (userId !== user.userId) {
            throw new Error("유저 아이디가 일치하지 않습니다");
        }
        // if (password !== user.password) {
        //     throw new Error("유저 패스워드가 일치하지 않습니다");
        // }
        const useredit = await this.usersRepository.userEdit(userId, name);
        return useredit;
    };
    aduserEdit = async (aduserId, adEmail, adPassword, adminName) => {
        const aduser = await this.usersRepository.aduserById(aduserId);

        console.log(aduser);
        if (adEmail !== aduser.adEmail) {
            throw new Error("유저 이메일이 일치하지 않습니다");
        }
        if (adPassword !== aduser.adPassword) {
            throw new Error("유저 패스워드가 일치하지 않습니다");
        }
        const aduseredit = await this.usersRepository.aduserEdit(aduserId, adEmail, adminName);
        return aduseredit;
    };
    userdelete = async (userId) => {
        const user = await this.usersRepository.userById(userId);
        console.log(user);
        // 미들웨어 추가시
        // if(user !== user.userId){
        //   throw new Error("유저가 일치하지 않습니다");
        // }
        if (!user) {
            throw new Error("유저가 일치하지 않습니다");
        }
        const userdelete = await this.usersRepository.userdelete(userId);
        // if(!userdelete){
        //   throw new Error("존재하지 않는 유저입니다.");
        // }
        return userdelete;
    };
    aduserdelete = async (aduserId) => {
        const aduser = await this.usersRepository.aduserById(aduserId);
        // if(aduser !== aduser.aduserId){
        //   throw new Error("어드민이 일치하지 않습니다");
        // }
        if (!aduser) {
            throw new Error("어드민이 일치하지 않습니다");
        }
        const aduserdelete = await this.usersRepository.aduserdelete(aduserId);
        // if(password !== user.password){
        //   throw new Error("유저 패스워드가 일치하지 않습니다");
        // }
        return aduserdelete;
    };
    useraccess = async (email, verifiCationToken) => {
        const user = await this.usersRepository.getUserByEmail(email);
        if (!user) {
            throw new Error("유저가 존재하지 않습니다.");
        }
        if (user.emailStatus !== "waiting") {
            throw new Error("이미 인증된 메일입니다.");
        }
        await this.pointsRepository.createPoint(user.userId);
        const update = await this.usersRepository.useraccess(user.userId, verifiCationToken);
        return update;
    };
    aduseraccess = async (adEmail, adVerifiCationToken) => {
        const aduser = await this.usersRepository.adByEmails(adEmail);
        if (!aduser) {
            throw new Error("유저가 존재하지 않습니다.");
        }
        if (aduser.adEmailStatus !== "waiting") {
            throw new Error("이미 인증된 메일입니다.");
        }
        const update = await this.usersRepository.aduseraccess(aduser.aduserId, adVerifiCationToken);
        return update;
    };
    getUserEmail = async (email) => {
        const user = await this.usersRepository.getUserByEmail(email);
        return user;
    };
    getadUserEmail = async (adEmail) => {
        const aduser = await this.usersRepository.adByEmails(adEmail);
        return aduser;
    };
    getUserPoint = async (userId) => {
        const point = await this.pointsRepository.getUserPoint(userId);

        return point;
    };
}
