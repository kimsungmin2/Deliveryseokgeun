export class QuizsController {
    constructor(quizsService) {
        this.quizsService = quizsService;
    }

    quizanswer = async (req, res, next) => {
        const { quizId } = req.params;
        const { userId } = req.user;
        const { quizanswer } = req.body;

        const quiz = await this.quizsService.quiz(quizId);
        console.log(quiz);
        const answer = quiz.quizanswer;

        if (answer === quizanswer) {
            const point = await this.quizsService.quizPoint(quizId, userId);
            console.log(point);
            return res.status(200).json({ message: "정답을 맞추셨습니다.", point });
        } else {
            return res.status(200).json({ message: "문제를 틀리셨습니다." });
        }
    };
    quizCreate = async (req, res, next) => {
        const { userId } = req.user;
        const { title, content, quizanswer } = req.body;

        await this.quizsService.quizCreate(userId, title, content, quizanswer);
        return res.status(201).json({ message: "문제가 생성되었습니다." });
    };
    quiztoday = async (req, res, next) => {
        const { quizId } = req.params;

        const quiz = await this.quizsService.quiztoday(quizId);
        const title = quiz.title;
        const content = quiz.content;
        console.log(quiz);
        return res.status(200).json({ title, content });
    };
}
