import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
export class StoresService {
    constructor(storesRepository) {
        this.storesRepository = storesRepository;
    }
    signIn = async (email, password) => {
        const store = await this.storesRepository.getStoreByEmail(email);

        const storeJWT = jwt.sign({ storeId: store.storeId }, process.env.JWT_SECRET, { expiresIn: "12h" });
        const refreshToken = jwt.sign({ storeId: store.storeId }, process.env.REFRESH_SECRET, { expiresIn: "7d" });

        return { storeJWT, refreshToken };
    };
}
