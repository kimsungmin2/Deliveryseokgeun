export class UsersController {
  constructor(usersService) {
    this.usersService = usersService;
  }
  signIn = async (req, res, next) => {
    const { email, password } = req.body;

    const tokens = await this.usersService.signIn(email, password);
    res.cookie("authorization", `Bearer ${tokens.userJWT}`);
    res.cookie("refreshToken", tokens.refreshToken);
    return res.status(200).json({ message: "로그인 성공" });
  };
}
