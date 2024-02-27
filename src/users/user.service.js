import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "../middlewares/sendEmail.middlewares.js";

dotenv.config();
export class UsersService {
  constructor(usersRepository, pointsRepository) {
    this.usersRepository = usersRepository;
    this.pointsRepository = pointsRepository;
  }
  signIn = async (email, password) => {
    const user = await this.usersRepository.getUserByEmail(email);

    const userJWT = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, {
      expiresIn: "12h",
    });
    const refreshToken = jwt.sign(
      { userId: user.userId },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    return userJWT, refreshToken;
  };

  hashPassword = async (password) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  };

  /// 고객님 회원가입
  register = async (email, name, password) => {
    const user = await this.usersRepository.getUserByEmail(email);

    if (user) {
      throw new Error("이미 등록된 이메일입니다.");
    }

    const hashedPassword = await this.hashPassword(password);

    const randomNum = () => {
      return Math.floor(1000 + Math.random() * 9000);
    };

    const token = randomNum();

    const usercreate = await this.usersRepository.registercreate(
      email,
      name,
      hashedPassword,
      token
    );

    await sendVerificationEmail(email, token);

    return usercreate;
  };

  adhashPassword = async (adPassword) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(adPassword, saltRounds);
    return hashedPassword;
  };

  /// 사장님 회원가입
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

    const adusercreate = await this.usersRepository.adregistercreate(
      adEmail,
      adminName,
      hashedPassword,
      token
    );

    await sendVerificationEmail(adEmail, token);

    return adusercreate;
  };

  useridedit = async (email, verifiCationToken) => {
    const user = await this.usersRepository.getUserByEmail(email);

    if (!user) {
      throw new Error("유저가 존재하지 않습니다.");
    }

    if (user.emailStatus !== "waiting") {
      throw new Error("이미 인증된 메일입니다.");
    }

    const update = await this.usersRepository.useridedit(
      user.userId,
      verifiCationToken
    );

    return update;
  };

  getUserEmail = async (email) => {
    const user = await this.usersRepository.getUserByEmail(email);

    return user;
  };

  getUserPoint = async (userId) => {
    const point = await this.pointsRepository.getUserPoint(userId);

    return point;
  };

  adsignIn = async (adEmail) => {
    const aduser = await this.usersRepository.getadUserByEmail(adEmail);

    const userJWT = jwt.sign(
      { aduserId: aduser.aduserId },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );
    const refreshToken = jwt.sign(
      { aduserId: aduser.aduserId },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    return { userJWT, refreshToken };
  };
}
