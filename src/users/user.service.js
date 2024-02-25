import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { emailStatus } from "@prisma/client";
import nodemailer from "nodemailer";

dotenv.config();
export class UsersService {
  constructor(usersRepository) {
    this.usersRepository = usersRepository;
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

  adsignIn = async (adEmail, adPassword) => {
    const aduser = await this.usersRepository.adByEmails(adEmail);

    const userJWT = jwt.sign({ aduserId: aduser.aduserId }, process.env.JWT_SECRET, {
      expiresIn: "12h",
    });
    const refreshToken = jwt.sign(
      { aduserId: aduser.aduserId },
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

  userregister = async (email, name, password, passwordconfirm) => {
    const user = await this.usersRepository.getUserByEmail(email);
    if (user) {
      throw new Error("이미 등록된 이메일입니다.");
    }
    const hashedPassword = await this.hashPassword(password);
    const usercreate = await this.usersRepository.registerucreate(
      email,
      name,
      hashedPassword
    );
    return user, usercreate;
  };

  aduserhashPassword = async (adPassword) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(adPassword, saltRounds);
    return hashedPassword;
  };

  adminregister = async (adEmail, adminName, adPassword, adPasswordconfirm) => {
    const aduser = await this.usersRepository.adByEmails(adEmail);

    if (aduser) {
      throw new Error("이미 등록된 이메일입니다.");
    }

    const hashedPassword = await this.aduserhashPassword(adPassword);

    const adusercreate = await this.usersRepository.registeracreate(
      adEmail,
      adminName,
      hashedPassword
    );

    return aduser, adusercreate;
  };

  useremailsend = async (email) => {
    
    const transporter = nodemailer.createTransport({
      service: process.env.SEND_SERVICES,
      auth: {
        user: process.env.SEND_MAIL_ID,
        pass: process.env.SEND_MAIL_PASSWORD,
      },
    });

    const verifyCode = {};

    const randomNum = () => {
        return Math.floor(Math.random() * 9999);
      };

    const random = randomNum();

    verifyCode[email] = random;

    const mailsend = {
      from: process.env.SEND_MAIL_ID,
      to: email,
      subject: "이메일 인증",
      text: `이메일 인증번호: ${random}`,
    };

    transporter.sendMail(mailsend, (err) => {
      if (err) {
         throw new Error("이메일 전송 중 오류가 발생했습니다.");
      }
    });

    return email;
  };

  aduseremailsend = async (adEmail) => {
    const transporter = nodemailer.createTransport({
      service: process.env.SEND_SERVICES,
      auth: {
        user: process.env.SEND_MAIL_ID,
        pass: process.env.SEND_MAIL_PASSWORD,
      },
    });

    const verifyCode = {};

    const randomNum = () => {
        return Math.floor(Math.random() * 9999);
      };

    const random = randomNum();

    verifyCode[adEmail] = random;

    const mailsend = {
      from: process.env.SEND_MAIL_ID,
      to: adEmail,
      subject: "어드민 이메일 인증",
      text: `어드민 이메일 인증번호: ${random}`,
    };

    transporter.sendMail(mailsend, (err) => {
      if (err) {
         throw new Error("이메일 전송 중 오류가 발생했습니다.");
      }
    });

    return adEmail;
  };
}
