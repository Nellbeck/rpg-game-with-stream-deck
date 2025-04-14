"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const enemy_controller_1 = require("../controllers/enemy.controller");
const router = express_1.default.Router();
const enemyController = new enemy_controller_1.EnemyController();
router.get("/", enemyController.getEnemies.bind(enemyController));
router.get("/active", enemyController.getActiveEnemies.bind(enemyController));
router.get("/:id", enemyController.getEnemyById.bind(enemyController));
router.post("/", enemyController.createEnemy.bind(enemyController));
router.delete("/:id", enemyController.deleteEnemy.bind(enemyController));
exports.default = router;
