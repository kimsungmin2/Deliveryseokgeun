// // src/middlewares/error-handling.middleware.js

// export default function (err, req, res, next) {
//   // 에러를 출력합니다.
//   console.error(err);

//   // 클라이언트에게 에러 메시지를 전달합니다.
//   res.status(500).json({ errorMessage: "서버 내부 에러가 발생했습니다." });
// }

//커스텀 에러
export default (err, req, res, next) => {
  switch (err.name) {
    case "ValidationError":
    case "PrismaClientValidationError":
      return res.status(400).json({ message: err.message });

    case "UnauthorizedError":
      return res.status(401).json({ message: err.message });

    case "NotFoundError":
      return res.status(404).json({ message: err.message });

    case "ConflictError":
      return res.status(409).json({ message: err.message });

    default:
      return res
        .status(500)
        .json({ message: "서버 내부 에러가 발생했습니다." });
  }
};
