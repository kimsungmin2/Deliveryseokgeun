import { OrdersRepository } from "./order.repository";

export class OrdersController {
  constructor(ordersService) {
    this.ordersService = ordersService;
  }
  createResume = async (req, res, next) => {
    try {
      const { storeId } = req.params;
      const { userId } = req.user;
      const { menuId, ea, ordercontent, orderstatus = "cooking" } = req.body;

      const order = await this.resumesService.createResume(
        userId,
        storeId,
        menuId,
        orderstatus,
        ea,
        ordercontent
      );

      return res
        .status(201)
        .json({ message: "주문에 성공하였습니다", data: order });
    } catch (err) {
      next(err);
    }
  };

  searchData = async (req, res, next) => {
    const { search } = req.body;

    if (!search) {
      return res.status(400).json({ message: "검색어를 입력해주세요" });
    }

    //검색키워드를 storeName에 포함한 가게들의 정보
    const searchData = await this.ordersService.findStore(search);
    return res.status(200).json({ data: searchData });
  };
}
