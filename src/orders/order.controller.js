import { OrdersService } from "./order.service.js";

export class OrdersController {
  ordersService = new OrdersService();

  // constructor(ordersService) {
  //   this.ordersService = ordersService;
  // }

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

  //입력받은 검색어를 가게이름에 포함하는 가게 & 메뉴이름에 포함하는 가게 검색기능
  searchData = async (req, res, next) => {
    const { search } = req.body;

    if (!search) {
      return res.status(400).json({ message: "검색어를 입력해주세요" });
    }

    //검색키워드를 storeName에 포함한 가게들의 정보
    const searchData = await this.ordersService.findStore(search);

    return res.status(200).json({ data: searchData });
  };

  //배달주문 조회 기능
  getOrderData = async (req, res, next) => {
    const { storeId } = req.params;
    const { userId } = req.user; //사장님도 같은 authMiddleware?

    const store = await this.ordersService.findStoreId(storeId);

    if (userId !== store.aduserId) {
      return res
        .status(403)
        .json({ message: "사장님만 주문 조회를 할 수 있습니다." });
    }

    const order = await this.ordersService.getOrderdata(storeId);
    return res.status(200).json({ data: order });
  };
}
