import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from 'bcrypt';

dotenv.config();
export class UsersService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    signIn = async (email, password) => {
        const user = await this.usersRepository.getUserByEmail(email);

        const userJWT = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET, { expiresIn: "12h" });
        const refreshToken = jwt.sign({ userId: user.userId }, process.env.REFRESH_SECRET, { expiresIn: "7d" });

        return userJWT, refreshToken;
    };

    userregister = async (email, password, passwordconfirm, name) => {
        const user = await this.usersRepository.getUserByEmail(email);

        const hashedPassword = await this.usersRepository.bcrypt.hash(password, 10);
        

        const usercreate = await this.usersRepository.registerucreate({
            email, password: hashedPassword, name
        });

        return user, usercreate;

    }
    
    

    adminregister = async (adEmail, adminName, adPassword, adPasswordconfirm) => {
        const store = await this.usersRepository.adByEmail(storeEmail); 
        
        const hashedPassword = await this.usersRepository.bcrypt.hash(adPassword, 10);

        const storecreate = await this.usersRepository.registeracreate({
            adEmail, adminName, adPassword : hashedPassword
        });

        return { store, storecreate };
    }
}
