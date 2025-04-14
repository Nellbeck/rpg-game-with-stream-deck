"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const combat_controller_1 = require("../controllers/combat.controller");
const router = express_1.default.Router();
const combatController = new combat_controller_1.CombatController();
// Battle route
router.post("/battle", combatController.battle.bind(combatController));
// Healing route
router.post("/heal", combatController.heal.bind(combatController));
exports.default = router;
