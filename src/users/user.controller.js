export class UsersController {
  constructor(usersService) {
    this.usersService = usersService;
  }
  signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;

    const tokens = await this.usersService.signIn(email, password);
    res.cookie("authorization", `Bearer ${tokens.userJWT}`);
    res.cookie("refreshToken", tokens.refreshToken);
    return res.status(200).json({ message: "로그인 성공" });
    } catch(err){
        next(err);
    }
  };


  userregister = async (req, res, next) => {
    try {
      const { email, name, password, passwordconfirm } = req.body;
        
  
  if (!email) {
    return res.status(400).json({ message: "가입하실 이메일을 적지 않았습니다." });
  }
  if (!password) {
    return res.status(400).json({ message: "가입하실 비밀번호를 적지 않았습니다." });
  }
  if (!passwordconfirm) {
    return res.status(400).json({ message: "비밀번호 확인란을 적지 않았습니다." });
  }
  
  if (!name) {
    return res.status(400).json({ message: "가입하실 이름을 적지 않았습니다." });
  }
  
  const users = await this.usersService.userregister(email, name, password, passwordconfirm);
  
  
  if (!users) {
    return res.status(400).json({ message: "유저가 존재하지 않습니다." });
  }
  
  if (password !== passwordconfirm) {
    return res
      .status(400)
      .json({ message: "가입하실 비밀번호가 비밀번호 확인란과 다릅니다" });
  }
  
    
  return res.status(201).json({ message : users })
    } catch (err) {
        next(err);
    }
  };
  
  adminregister = async (req, res, next) => {
    try {
        const { adEmail, adminName, adPassword, adPasswordconfirm } = req.body;
        
  
  
  if (!adEmail) {
    return res.status(400).json({ message: "가입하실 이메일을 적지 않았습니다." });
  }
  if (!adminName) {
    return res.status(400).json({ message: "가입하실 이름을 적지 않았습니다." });
  }
  if (!adPassword) {
    return res.status(400).json({ message: "가입하실 비밀번호를 적지 않았습니다." });
  }
  
  if (!adPasswordconfirm) {
    return res.status(400).json({ message: "비밀번호 확인란을 적지 않았습니다." });
  }
  
  
  const adusers = await this.usersService.adminregister(adEmail, adminName, adPassword, adPasswordconfirm);
  
  
  // if (!adusers) {
  //   return res.status(400).json({ message: "유저가 존재하지 않습니다." });
  // }
  
  if (adPassword !== adPasswordconfirm) {
    return res
      .status(400)
      .json({ message: "가입하실 비밀번호가 비밀번호 확인란과 다릅니다" });
  }
  
    
  return res.status(201).json({ message : adusers })
    } catch (err) {
        next(err);
    }
  };
}


