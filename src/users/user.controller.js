export class UsersController {
  constructor(usersService) {
    this.usersService = usersService;
  }
  signIn = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      
      if (
        !email.includes("@naver.com") &&
        !email.includes("@daum.net") &&
        !email.includes("@goole.com") &&
        !email.includes("@googlemail.com") &&
        !email.includes("@hanmail.net") &&
        !email.includes("@icloud.com") &&
        !email.includes("@cyworld.com") &&
        !email.includes("@kakao.com") &&
        !email.includes("@mail.com") &&
        !email.includes("@narasarang.or.kr") &&
        !email.includes("@tistory.com")
      ) {
        return res
          .status(400)
          .json({ message: "이메일 조건이 맞지 않습니다." });
      }

      const tokens = await this.usersService.signIn(email, password);
      res.cookie("authorization", `Bearer ${tokens.userJWT}`);
      res.cookie("refreshToken", tokens.refreshToken);
      return res.status(200).json({ message: "로그인 성공" });
    } catch (err) {
      next(err);
    }
  };

  userregister = async (req, res, next) => {
    try {
      const { email, name, password, passwordconfirm } = req.body;

      if (!email) {
        return res
          .status(400)
          .json({ message: "가입하실 이메일을 적지 않았습니다." });
      }
      if (!password) {
        return res
          .status(400)
          .json({ message: "가입하실 비밀번호를 적지 않았습니다." });
      }
      if (!passwordconfirm) {
        return res
          .status(400)
          .json({ message: "비밀번호 확인란을 적지 않았습니다." });
      }

      if (!name) {
        return res
          .status(400)
          .json({ message: "가입하실 이름을 적지 않았습니다." });
      }

      if (!email) {
        return res.status(400).json({ message: "이메일이 존재하지 않습니다." });
      }

      if (
        !email.includes("@naver.com") &&
        !email.includes("@daum.net") &&
        !email.includes("@goole.com") &&
        !email.includes("@googlemail.com") &&
        !email.includes("@hanmail.net") &&
        !email.includes("@icloud.com") &&
        !email.includes("@cyworld.com") &&
        !email.includes("@kakao.com") &&
        !email.includes("@mail.com") &&
        !email.includes("@narasarang.or.kr") &&
        !email.includes("@tistory.com")
      ) {
        return res
          .status(400)
          .json({ message: "이메일 조건이 맞지 않습니다." });
      }

      const users = await this.usersService.userregister(
        email,
        name,
        password,
        passwordconfirm
      );

      if (!users) {
        return res.status(400).json({ message: "유저가 존재하지 않습니다." });
      }

      if (password !== passwordconfirm) {
        return res
          .status(400)
          .json({ message: "가입하실 비밀번호가 비밀번호 확인란과 다릅니다" });
      }

      return res.status(201).json({ message: users });
    } catch (err) {
      next(err);
    }
  };

  adminregister = async (req, res, next) => {
    try {
      const { adEmail, adminName, adPassword, adPasswordconfirm } = req.body;

      if (!adEmail) {
        return res
          .status(400)
          .json({ message: "가입하실 이메일을 적지 않았습니다." });
      }
      if (!adminName) {
        return res
          .status(400)
          .json({ message: "가입하실 이름을 적지 않았습니다." });
      }
      if (!adPassword) {
        return res
          .status(400)
          .json({ message: "가입하실 비밀번호를 적지 않았습니다." });
      }

      if (!adPasswordconfirm) {
        return res
          .status(400)
          .json({ message: "비밀번호 확인란을 적지 않았습니다." });
      }

      if (
        !adEmail.includes("@naver.com") &&
        !adEmail.includes("@daum.net") &&
        !adEmail.includes("@goole.com") &&
        !adEmail.includes("@googlemail.com") &&
        !adEmail.includes("@hanmail.net") &&
        !adEmail.includes("@icloud.com") &&
        !adEmail.includes("@cyworld.com") &&
        !adEmail.includes("@kakao.com") &&
        !adEmail.includes("@mail.com") &&
        !adEmail.includes("@narasarang.or.kr") &&
        !adEmail.includes("@tistory.com")
      ) {
        return res
          .status(400)
          .json({ message: "이메일 조건이 맞지 않습니다." });
      }

      const adusers = await this.usersService.adminregister(
        adEmail,
        adminName,
        adPassword,
        adPasswordconfirm
      );

      if (!adusers) {
        return res.status(400).json({ message: "유저가 존재하지 않습니다." });
      }

      if (adPassword !== adPasswordconfirm) {
        return res
          .status(400)
          .json({ message: "가입하실 비밀번호가 비밀번호 확인란과 다릅니다" });
      }

      return res.status(201).json({ message: adusers });
    } catch (err) {
      next(err);
    }
  };

  useremailsend = async (req, res, next) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "이메일이 존재하지 않습니다." });
      }

      if (
        !email.includes("@naver.com") &&
        !email.includes("@daum.net") &&
        !email.includes("@goole.com") &&
        !email.includes("@googlemail.com") &&
        !email.includes("@hanmail.net") &&
        !email.includes("@icloud.com") &&
        !email.includes("@cyworld.com") &&
        !email.includes("@kakao.com") &&
        !email.includes("@mail.com") &&
        !email.includes("@narasarang.or.kr") &&
        !email.includes("@tistory.com")
      ) {
        return res
          .status(400)
          .json({ message: "이메일 조건이 맞지 않습니다." });
      }

      await this.usersService.useremailsend(email);

      return res
        .status(201)
        .json({ admin: false, message: "이메일 인증번호 전송완료" });
    } catch (err) {
      next(err);
    }
  };

  aduseremailsend = async (req, res, next) => {
    try {
      const { adEmail } = req.body;

      if (!adEmail) {
        return res.status(400).json({ message: "이메일이 존재하지 않습니다." });
      }

      if (
        !adEmail.includes("@naver.com") &&
        !adEmail.includes("@daum.net") &&
        !adEmail.includes("@goole.com") &&
        !adEmail.includes("@googlemail.com") &&
        !adEmail.includes("@hanmail.net") &&
        !adEmail.includes("@icloud.com") &&
        !adEmail.includes("@cyworld.com") &&
        !adEmail.includes("@kakao.com") &&
        !adEmail.includes("@mail.com") &&
        !adEmail.includes("@narasarang.or.kr") &&
        !adEmail.includes("@tistory.com")
      ) {
        return res
          .status(400)
          .json({ message: "이메일 조건이 맞지 않습니다." });
      }

      await this.usersService.aduseremailsend(adEmail);
      return res
        .status(201)
        .json({ admin: true, message: "어드민 계정 이메일 인증번호 전송완료" });
    } catch (err) {
      next(err);
    }
  };
}
