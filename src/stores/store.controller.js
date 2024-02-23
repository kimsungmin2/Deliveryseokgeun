export class StoresController {
    constructor(storesService) {
        this.storesService = storesService;
    }
    signIn = async (req, res, next) => {
        const { email, password } = req.body;

        const tokens = await this.storesService.signIn(email, password);
        res.cookie("authorization", `Bearer ${tokens.sotreJWT}`);
        res.cookie("refreshToken", tokens.refreshToken);
        return res.status(200).json({ message: "로그인 성공" });
    };
}
