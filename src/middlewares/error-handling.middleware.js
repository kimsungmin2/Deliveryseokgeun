//커스텀 에러
export default (err, req, res, next) => {
  switch (err.name) {
    case "ValidationError":
    case "PrismaClientValidationError":
      return res.status(400).json({ message: err.message });


    case "UnauthorizedError":
      return res.status(401).json({ message: err.message });

    case "ForbiddenError":
      return res.status(403).json({ message: err.message });

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
