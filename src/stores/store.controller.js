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
    readystatusup = async (req, res, next) => {
        try {
            const { storeId, orderId } = req.params;
            const { aduserId } = req.user;
            const { orderStatus = "deliveryReady" } = req.body;
            const store = await this.storesService.getStoreById(storeId);
            console.log(store.aduserId);
            if (aduserId !== store.aduserId) return res.status(401).json({ message: "권한이 없습니다." });

            const updatedOrder = await this.storesService.readystatusup(orderId, storeId, orderStatus);
            return res.status(200).json({ message: "배달이 준비중입니다." });
        } catch (err) {
            next(err);
        }
    };
    ingstatusup = async (req, res, next) => {
        try {
            const { storeId, orderId } = req.params;
            const { aduserId } = req.user;
            const { orderStatus = "delivering" } = req.body;
            const store = await this.storesService.getStoreById(storeId);
            console.log(store.aduserId);
            if (aduserId !== store.aduserId) return res.status(401).json({ message: "권한이 없습니다." });

            const updatedOrder = await this.storesService.ingstatusup(orderId, storeId, orderStatus);
            return res.status(200).json({ message: "배달이 시작되었습니다." });
        } catch (err) {
            next(err);
        }
    };
    completestatusup = async (req, res, next) => {
        try {
            const { storeId, orderId } = req.params;
            const { aduserId } = req.user;
            const { orderStatus = "deliveryCompleted" } = req.body;
            const store = await this.storesService.getStoreById(storeId);
            console.log(store.aduserId);
            if (aduserId !== store.aduserId) return res.status(401).json({ message: "권한이 없습니다." });

            const updatedOrder = await this.storesService.completestatusup(orderId, storeId, orderStatus);
            return res.status(200).json({ message: "배달이 완료되었습니다." });
        } catch (err) {
            next(err);
        }
    };
}
