import express from "express";
import { EnemyController } from "../controllers/enemy.controller";

const router = express.Router();
const enemyController = new EnemyController();

router.get("/", enemyController.getEnemies.bind(enemyController));
router.get("/active", enemyController.getActiveEnemies.bind(enemyController));
router.get("/:id", enemyController.getEnemyById.bind(enemyController));
router.post("/", enemyController.createEnemy.bind(enemyController));
router.delete("/:id", enemyController.deleteEnemy.bind(enemyController));  

export default router;

