import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
export class UsersService {
    constructor(usersRepository, pointsRepository) {
        this.usersRepository = usersRepository;
        this.pointsRepository = pointsRepository;
    }
    signIn = async (email) => {
        const user = await this.usersRepository.getUserByEmail(email);

        const userJWT = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: "12h" });
        const refreshToken = jwt.sign({ userId: user.userId }, process.env.REFRESH_SECRET, { expiresIn: "7d" });

        return { userJWT, refreshToken };
    };

    adsignIn = async (adEmail) => {
        const aduser = await this.usersRepository.getadUserByEmail(adEmail);

        const userJWT = jwt.sign({ aduserId: aduser.aduserId }, process.env.JWT_SECRET, { expiresIn: "12h" });
        const refreshToken = jwt.sign({ aduserId: aduser.aduserId }, process.env.REFRESH_SECRET, { expiresIn: "7d" });

        return { userJWT, refreshToken };
    };
    getUserPoint = async (userId) => {
        const point = await this.pointsRepository.getUserPoint(userId);

        return point;
    };
}
