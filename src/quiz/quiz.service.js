export class QuizsService {
    constructor(quizsRepository, pointsrepository) {
        this.quizsRepository = quizsRepository;
        this.pointsrepository = pointsrepository;
    }

    quizPoint = async (quizId, userId) => {
        const randomNumber = Math.random();
        const answer = await this.quizsRepository.quizById(quizId);
        let possession;
        if (randomNumber < 0.03) {
            possession = 20000;
        } else if (randomNumber < 0.1) {
            possession = 10000;
            return possession;
        } else {
            return "꽝";
        }

        const history = `${answer.title}에서 획득한 포인트`;

        const quiz = await this.pointsrepository.quizPoint(userId, possession, history);
        return possession;
    };

    quiz = async (quizId) => {
        const answer = await this.quizsRepository.quizById(quizId);
        return answer;
    };

    quizCreate = async (userId, title, content, quizanswer) => {
        const quiz = await this.quizsRepository.quizCreate(userId, title, content, quizanswer);
        return quiz;
    };
}
