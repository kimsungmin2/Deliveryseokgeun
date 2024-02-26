export class PointsService {
    constructor(pointsRepository) {
        this.pointsRepository = pointsRepository;
    }
    getUserPoint = async (userId) => {
        const user = await this.pointsRepository.getUserPoint(userId);
        if (!user) throw new Error("존재하지 않는 유저입니다.");
        return user;
    };
}
