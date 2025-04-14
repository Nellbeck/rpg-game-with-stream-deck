import express from "express";
import { CombatController } from "../controllers/combat.controller";

const router = express.Router();
const combatController = new CombatController();

// Battle route
router.post("/battle", combatController.battle.bind(combatController));

// Healing route
router.post("/heal", combatController.heal.bind(combatController));

export default router;
