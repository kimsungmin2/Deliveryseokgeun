import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const { SEND_MAIL_ID, user, pass } = process.env;

const transporter = nodemailer.createTransport({
  service: process.env.SEND_MAIL_ID,
  auth: {
    user: user,
    pass: pass,
  },
});

export const sendVerificationEmail = (email, token) => {
  return new Promise((resolve, reject) => {
    const verificationLink = `http://localhost:3020/email?token=${token}`;

    const mailOptions = {
      from: process.env.user,
      to: email,
      subject: "이메일 인증",
      text: `아래의 인증 코드를 입력하여 이메일 인증을 완료해주세요: ${token}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};
