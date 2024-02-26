import express from "express";
import multers3 from "multer-s3";
import multer from "multer";
import { prisma } from "../utils/index.js";
import adAuthMiddleware from "../src/middlewares/adauth.middlewares.js";
import authMiddleware from "../src/middlewares/auth.middlewares.js";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const router = express.Router();

//s3 서비스 접근을 위해 액세스키 설정 후, S3Client 객체 생성
const s3 = new S3Client({
  region: process.env.IMG_REGION,
  credentials: {
    accessKeyId: process.env.IMG_DATA,
    secretAccessKey: process.env.IMG_SECRETKEY,
  },
});

//multer를 사용해 파일 업로드를 처리하는 미들웨어 생성(S3에 저장)
const upload = multer({
  storage: multers3({
    s3, //s3객체 전달, 이를 통해 aws s3에 저장됨
    bucket: process.env.IMG_BUCKET, //파일이 저장될 버킷 선택
    contentType: multers3.AUTO_CONTENT_TYPE, //업로드 된 파일 컨텐츠 타입을 자동 설정
    key: (req, file, cb) => {
      cb(null, `${Date.now().toString()}_${file.originalname}`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 }, // 최대 10MB 파일 업로드 허용
});

//궁금한것. . 이렇게 하면 파일 사진 포스트와 삭제만 되는겨???
router.post(
  "/image/:postId",
  authMiddleware,
  upload.single("image"),
  async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { postId } = req.params;
      const { postimg } = req.body;
      const post = await prisma.post.findFirst({
        where: { postId: +postId },
      });
      if (post.userId !== userId) {
        return res.status(401).json({ message: "수정할 권한이 없습니다." });
      }
      const posts = await prisma.post.update({
        where: { postId: +postId },
        data: {
          postimg,
        },
      });
      return res.status(201).json({ data: posts });
    } catch (error) {
      console.error(error.message);
      if (!upload) throw new Error("메시지 업로드 오류");
      return res.status(500).json({ message: "서버 전송 오류" });
    }
  }
);

router.delete("/image/:postId", authMiddleware, async (req, res, next) => {
  try {
    const { postimg } = req.body;
    const { userId } = req.user;
    const { postId } = req.params;

    const post = await prisma.post.findFirst({
      where: { postId: +postId },
    });

    if (post.userId !== userId) {
      return res.status(401).json({ message: "수정할 권한이 없습니다." });
    }

    const command = new DeleteObjectCommand({
      Bucket: process.env.IMG_BUCKET,
      Key: postimg,
    });
    await s3.send(command);

    await prisma.post.update({
      where: { postId: +postId },
      data: {
        postimg: null,
      },
    });

    return res.status(200).json({ message: "삭제 완료" });
  } catch (error) {
    console.error(error.message);
  }
});

export default router;
