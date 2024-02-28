export class QuizsController {
    constructor(quizsController) {
        this.quizsController = quizsController;
    }

    Quiz = async (req, res, next) => {
        const { userId } = req.user;
        const { answerId } = req.body;

        const answer = await this.quizsController.Quiz(answerId);

        if (answer) {
            await this.quizsController.Quiz(userId);
        } else {
            return "정답이 아닙니다.";
        }
    };
}
