import express from "express";
import { prisma } from "../../prisma/index.js";
import { QuizsController } from "./quiz.controller.js";
import { QuizsRepository } from "./quiz.Repository.js";
import { QuizsService } from "./quiz.service.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";
import { PointsRepository } from "../points/point.repository.js";

const router = express.Router();

const quizsRepository = new QuizsRepository(prisma);
const pointsRepository = new PointsRepository(prisma);
const quizsService = new QuizsService(quizsRepository, pointsRepository);

const quizsController = new QuizsController(quizsService);

router.post("/", authMiddleware, quizsController.quizCreate);

router.post("/:quizId", authMiddleware, quizsController.quizanswer);

export default router;
