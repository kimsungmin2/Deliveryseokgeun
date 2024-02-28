export class QuizsRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }
    quizById = async (quizId) => {
        const quiz = await this.prisma.quizs.findFirst({ where: { quizId: +quizId } });
        return quiz;
    };
    quizCreate = async (userId, title, content, quizanswer) => {
        const quiz = await this.prisma.quizs.create({ data: { userId: +userId, title, content, quizanswer } });
        return quiz;
    };
}
