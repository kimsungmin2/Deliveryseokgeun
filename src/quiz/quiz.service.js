export class PointsService {
    constructor(quizsRepository) {
        this.quizsRepository = quizsRepository;
    }

    quizPoint = async (userId) => {
        const randomNumber = Math.random();

        let possession;
        if (randomNumber < 0.03) {
            possession = 20000;
        } else if (randomNumber < 0.1) {
            possession = 10000;
        } else {
            return "꽝";
        }
    };
}
