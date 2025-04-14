"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const enemy_controller_1 = require("../controllers/enemy.controller");
const router = express_1.default.Router();
router.get("/", enemy_controller_1.getEnemies);
router.post("/", enemy_controller_1.createEnemy); // optionally secure this if needed
exports.default = router;
