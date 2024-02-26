export class UsersController {
    constructor(usersService, pointsService) {
        this.usersService = usersService;
        this.pointsService = pointsService;
    }
    signIn = async (req, res, next) => {
        const { email, password } = req.body;

        const tokens = await this.usersService.signIn(email, password);
        res.cookie("authorization", `Bearer ${tokens.userJWT}`);
        res.cookie("refreshToken", tokens.refreshToken);
        return res.status(200).json({ message: "로그인 성공" });
    };
    adsignIn = async (req, res, next) => {
        const { adEmail, adPassword } = req.body;

        const tokens = await this.usersService.adsignIn(adEmail, adPassword);
        res.cookie("authorization", `Bearer ${tokens.userJWT}`);
        res.cookie("refreshToken", tokens.refreshToken);
        return res.status(200).json({ message: "로그인 성공" });
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
