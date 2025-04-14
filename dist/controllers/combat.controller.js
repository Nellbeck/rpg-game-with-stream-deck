"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CombatController = void 0;
const character_model_1 = require("../models/character.model");
const enemy_model_1 = require("../models/enemy.model");
const combat_utils_1 = require("../utils/combat.utils");
class CombatController {
    async battle(req, res) {
        const { characterId, enemyId } = req.body;
        try {
            const character = await character_model_1.Character.findById(characterId);
            const enemy = await enemy_model_1.Enemy.findById(enemyId);
            if (!character || !enemy) {
                res.status(404).json({ error: "Character or enemy not found." });
                return;
            }
            // Simulate the combat
            const battleResult = (0, combat_utils_1.simulateCombat)(character, enemy);
            // If character won, update their stats and save
            if (battleResult.characterWon) {
                // Experience and gold are already updated in the simulateCombat function
                // Save the character with updated stats
                await character.save();
                // Remove or mark the enemy as defeated
                enemy.stats.health = 0;
                await enemy.save();
            }
            else {
                // Character lost
                // You could implement some penalty here if desired
                // For example: lose a percentage of gold
                // Restore enemy health for future battles
                enemy.stats.health = enemy.stats.health;
                await enemy.save();
            }
            res.json(battleResult);
        }
        catch (error) {
            console.error("Combat error:", error);
            res.status(500).json({ error: "Combat simulation failed." });
        }
    }
    async heal(req, res) {
        const { characterId, amount } = req.body;
        try {
            const character = await character_model_1.Character.findById(characterId);
            if (!character) {
                res.status(404).json({ error: "Character not found." });
                return;
            }
            // Calculate healing cost
            const healCost = amount * 2; // 2 gold per HP
            if (character.gold < healCost) {
                res.status(400).json({ error: "Not enough gold for healing." });
                return;
            }
            // Apply healing
            character.stats.health = Math.min(character.stats.health + amount, character.level * 10 + 50 // Example max health formula
            );
            character.gold -= healCost;
            await character.save();
            res.json({
                message: `Healed ${amount} HP for ${healCost} gold.`,
                currentHealth: character.stats.health,
                remainingGold: character.gold
            });
        }
        catch (error) {
            console.error("Healing error:", error);
            res.status(500).json({ error: "Healing failed." });
        }
    }
}
exports.CombatController = CombatController;
