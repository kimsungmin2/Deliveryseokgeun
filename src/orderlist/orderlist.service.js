export class OrderlistService {
    constructor(orderlistRepository) {
        this.orderlistRepository = orderlistRepository;
    }

    getOrderlistById = async (orderlistId, orderId, menuId) => {
        const orderlist = await this.orderlistRepository.getOrderlistById(orderlistId, orderId, menuId);
        if (!orderlist) {
            throw new Error("해당 오더를 찾을 수 없습니다.");
        }

        return orderlist;
    };
}
