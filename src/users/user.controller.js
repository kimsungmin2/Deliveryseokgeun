export class UsersController {
  constructor(usersService,pointsService) {
    this.usersService = usersService;
    this.pointsService = pointsService;
  }
  signIn = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      if (!email) {
        return res.status(400).json({ message: "이메일이 존재하지 않습니다." });
      }

      if (!password) {
        return res
          .status(400)
          .json({ message: "비밀번호가 존재하지 않습니다." });
      }

      if (
        !email.includes("@naver.com") &&
        !email.includes("@daum.net") &&
        !email.includes("@google.com") &&
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

  // 고객님 회원가입
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


      if (
        !email.includes("@naver.com") &&
        !email.includes("@daum.net") &&
        !email.includes("@google.com") &&
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

      if (password !== passwordconfirm) {
        return res
          .status(400)
          .json({ message: "가입하실 비밀번호가 비밀번호 확인란과 다릅니다" });
      }

      const users = await this.usersService.register(email, name, password);

      return res.status(201).json({ message: users });
    } catch (err) {
      next(err);
    }
  };

  // 어드민 회원가입
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
        !adEmail.includes("@google.com") &&
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

      if (adPassword !== adPasswordconfirm) {
        return res
          .status(400)
          .json({ message: "가입하실 비밀번호가 비밀번호 확인란과 다릅니다" });
      }

      const adusers = await this.usersService.adregister(
        adEmail,
        adminName,
        adPassword
      );

      return res.status(201).json({ message: adusers });
    } catch (err) {
      next(err);
    }
  };

  userIdedit = async (req, res, next) => {
    try {
      const { email, verifiCationToken } = req.body;

      const user = await this.usersService.getUserEmail(email);

      if (verifiCationToken !== user.verifiCationToken) {
        return res
          .status(401)
          .json({ message: "인증번호가 일치하지 않습니다." });
      }

      await this.usersService.useridedit(email, verifiCationToken);

      return res.status(201).json({ message: "회원정보 상태 변경완료" });
    } catch (err) {
      next(err);
    }
  };
    getUserPoint = async (req, res, next) => {
        try {
            const { userId } = req.user;

            const user = await this.usersService.getUserPoint(userId);

            return res.status(200).json({ message: `현재 고객님의 포인트는 ${user[0]._sum.possession}원 있습니다.` });
        } catch (err) {
            next(err);
        }
    };
      
}
