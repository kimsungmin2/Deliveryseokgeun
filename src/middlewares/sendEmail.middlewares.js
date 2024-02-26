import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// 인증코드 보관 객체 생성
const verifyCode = {};

// 임의의 숫자 생성(인증코드)
const randomNum = () => {
  return Math.floor(Math.random() * 9999);
};

const { email_service, user, pass } = process.env;
// 트랜스포터 라는 것을 이용해서 이메일을 보낼 것이다.
const transporter = nodemailer.createTransport({
  service: process.env.email_service,
  auth: {
    user: user, // 보내는 사람의 이메일과 비밀번호
    pass: pass,
  },
});

export const sendVerificationEmail = (email , token) => {
  return new Promise((resolve, reject) => {
    const random = randomNum();
    const verificationLink = `http://localhost:3020/email?token=${token}`;
  
    // 인증코드 보관 객체 속 이메일(속성&키) : 임의의 숫자(인증코드)
    verifyCode[email] = random;

    // 보낼 메일 양식 설정
    const mailOptions = {
      from: process.env.user,
      to: email, // 받아온 이메일
      subject: "이메일 인증", // 제목
      text: `아래의 인증 코드를 입력하여 이메일 인증을 완료해주세요: ${token}`, // 내용
    };
    // 메일 발송, 성공시엔 info 라는 매개변수에 값이 전달됨
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
};
