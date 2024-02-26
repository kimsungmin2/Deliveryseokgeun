import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const { SEND_MAIL_ID, SEND_MAIL_PASSWORD, SEND_SERVICES } = process.env;



const transporter = nodemailer.createTransport({
  service: SEND_SERVICES,
  auth: {
    user: SEND_MAIL_ID,
    pass: SEND_MAIL_PASSWORD,
  },
});

export const sendVerificationEmail = (email, token) => {
  return new Promise((resolve, reject) => {
    
    const mailOptions = {
      from: SEND_MAIL_ID,
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
