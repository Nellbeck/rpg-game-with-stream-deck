import express from "express";
import { getEnemies, createEnemy } from "../controllers/enemy.controller";

const router = express.Router();

router.get("/", getEnemies);
router.post("/", createEnemy); // optionally secure this if needed

export default router;
