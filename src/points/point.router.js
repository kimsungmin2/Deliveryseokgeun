import express from "express";
import { prisma } from "../../prisma/index.js";
import { PointsService } from "./point.service.js";
import { PointsRepository } from "./point.repository.js";

const router = express.Router();

const pointsRepository = new PointsRepository(prisma);

const pointsService = new PointsService(pointsRepository);

export default router;
