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
     
     
    if(user === null){
      throw new Error("유저가 존재하지 않습니다.")
    }

    if(user.emailStatus !== "completion"){
      throw new Error("활성화 되지 않은 어드민입니다.");
    }

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
 

  adsignIn = async (adEmail) => {
    const aduser = await this.usersRepository.getAdByEmails(adEmail);

    if(aduser === null){
      throw new Error("유저가 존재하지 않습니다.")
    }
    
    if(aduser.adEmailStatus !== "completion"){
      throw new Error("활성화 되지 않은 어드민입니다.");
    }

    const userJWT = jwt.sign({ aduserId: aduser.aduserId }, process.env.JWT_SECRET, { expiresIn: "12h" });
    const refreshToken = jwt.sign({ aduserId: aduser.aduserId }, process.env.REFRESH_SECRET, { expiresIn: "7d" });
    return { userJWT, refreshToken };
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
    const aduser = await this.usersRepository.getAdByEmails(adEmail);
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

  getUser = async (userId) => {

    const users = await this.usersRepository.getUserById(userId);

    if(users === null){
      throw new Error("조회하시는 유저가 존재하지 않습니다.");
    }

    if(users.emailStatus !== "completion"){
      throw new Error("활성화 되지 않은 유저입니다.");
    }

    return users;
  };

  getUsermany = async () => {
    const users = await this.usersRepository.getUsermany();

    return users;
  };

  getadUser = async (aduserId) => {

    const adusers = await this.usersRepository.getadUserById(aduserId);

    if(adusers === null){
      throw new Error("조회하시는 어드민이 존재하지 않습니다.");
    }

    if(adusers.adEmailStatus !== "completion"){
      throw new Error("활성화 되지 않은 유저입니다.");
    }

    return adusers;
  };

  getadUsermany = async () => {
    const adusers = await this.usersRepository.adgetUsermany();

    return adusers;
  };

  userEdit = async (userId, email, password, name) => {
    const userIds = await this.usersRepository.userById(userId);
    const hashedPassword = this.hashPassword(password);
    
    if(!userIds){
      throw new Error("유저가 존재하지 않습니다.");
    }

    if(userId !== userIds.userId){
      throw new Error("어드민 아이디가 일치하지 않습니다");
    }

    if(userIds.emailStatus !== "completion"){
      throw new Error("활성화 되지 않은 유저입니다.");
    }

    const passwordMatch = await bcrypt.compare(password, userIds.password);

    if (!passwordMatch) {
        throw new Error("현재 비밀번호가 일치하지 않습니다.");
    }

    const update = await this.usersRepository.userEdit(userId, name);
    return update;
  }

  aduserEdit = async (aduserId, adEmail, adPassword, adminName) => {
    const aduser = await this.usersRepository.getAdByEmails(adEmail);
    const hashedPassword = this.hashPassword(adPassword);

    if(!aduser){
      throw new Error("어드민이 존재하지 않습니다");
    }

    if(aduserId !== aduser.aduserId){
      throw new Error("어드민 아이디가 일치하지 않습니다");
    }

    if(aduser.adEmailStatus !== "completion"){
      throw new Error("활성화 되지 않은 어드민입니다.");
    }

    const passwordMatch = await bcrypt.compare(adPassword, aduser.adPassword);

    if (!passwordMatch) {
        throw new Error("현재 비밀번호가 일치하지 않습니다.");
    }

    const update = await this.usersRepository.aduserEdit(aduserId, hashedPassword, adminName);

    return update;
  }

  userdelete = async (userId, password) => {
    const user = await this.usersRepository.userById(userId);
  
    if(!user) {
      throw new Error("유저가 존재하지 않습니다");
    }

    if(userId !== user.userId){
      throw new Error("유저 아이디가 일치하지 않습니다");
    }

    if(user.emailStatus !== "completion"){
      throw new Error("활성화 되지 않은 유저입니다.");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        throw new Error("현재 비밀번호가 일치하지 않습니다.");
    }
    
    const userdelete = await this.usersRepository.userdelete(userId);

    return userdelete;
  }
  
  aduserdelete = async (aduserId, adPassword) => {
    const aduser = await this.usersRepository.aduserById(aduserId);

    if(aduserId !== aduser.aduserId){
      throw new Error("어드민 아이디가 일치하지 않습니다");
    }

    if(!aduser) {
      throw new Error("어드민이 존재하지 않습니다");
    }

    if(aduser.emailStatus !== "completion"){
      throw new Error("활성화 되지 않은 유저입니다.");
    }

    const passwordMatch = await bcrypt.compare(adPassword, aduser.adPassword);

    if (!passwordMatch) {
        throw new Error("현재 비밀번호가 일치하지 않습니다.");
    }

    const aduserdelete = await this.usersRepository.aduserdelete(aduserId);


    return aduserdelete;
  }

  useraccess = async (email, verifiCationToken) => {
    const user = await this.usersRepository.getUserByEmail(email);

    if (!user) {
      throw new Error("유저가 존재하지 않습니다.");
    }

    if (user.emailStatus !== "waiting") {
      throw new Error("이미 인증된 메일입니다.");
    }

    const update = await this.usersRepository.useraccess(
      user.userId,
      verifiCationToken
    );

    return update;
  };

  aduseraccess = async (adEmail, adVerifiCationToken) => {
    const aduser = await this.usersRepository.getAdByEmails(adEmail);

    if (!aduser) {
      throw new Error("어드민이 존재하지 않습니다.");
    }

    if (aduser.adEmailStatus !== "waiting") {
      throw new Error("이미 인증된 메일입니다.");
    }

    const update = await this.usersRepository.aduseraccess(
      aduser.aduserId,
      adVerifiCationToken
    );

    return update;
  };


  getUserEmail = async (email) => {
    const user = await this.usersRepository.getUserByEmail(email);
    return user;
  }

  getadUserEmail = async (adEmail) => {
    const aduser = await this.usersRepository.getAdByEmails(adEmail);

    return aduser;
  };

 getUserPoint = async (userId) => {
        const point = await this.pointsRepository.getUserPoint(userId);
        return point;
    };
}

