"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnemyController = void 0;
const enemy_model_1 = require("../models/enemy.model");
class EnemyController {
    // Get all enemies
    async getEnemies(_req, res) {
        try {
            const enemies = await enemy_model_1.Enemy.find();
            res.status(200).json(enemies);
        }
        catch (error) {
            console.error("Error fetching enemies:", error);
            res.status(500).json({ message: "Failed to fetch enemies" });
        }
    }
    // Get active enemies (with health > 0)
    async getActiveEnemies(_req, res) {
        try {
            console.log("Processing request for active enemies");
            const activeEnemies = await enemy_model_1.Enemy.find({ "stats.health": { $gt: 0 } })
                .limit(5)
                .select("_id name stats.health stats.attack stats.defense");
            console.log(`Found ${activeEnemies.length} active enemies`);
            res.status(200).json(activeEnemies);
        }
        catch (error) {
            console.error("Error fetching active enemies:", error);
            res.status(500).json({ message: "Failed to fetch active enemies" });
        }
    }
    // Get enemy by ID
    async getEnemyById(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({ message: "Enemy ID is required" });
                return;
            }
            const enemy = await enemy_model_1.Enemy.findById(id);
            if (!enemy) {
                res.status(404).json({ message: "Enemy not found" });
                return;
            }
            res.status(200).json(enemy);
        }
        catch (error) {
            console.error("Error fetching enemy:", error);
            res.status(500).json({ message: "Failed to fetch enemy" });
        }
    }
    // Create new enemy
    async createEnemy(req, res) {
        try {
            const { type, name, level, stats } = req.body;
            if (!type || !name || !level || !stats) {
                res.status(400).json({ message: "Missing required fields" });
                return;
            }
            const newEnemy = new enemy_model_1.Enemy({
                type,
                name,
                level,
                stats
            });
            const savedEnemy = await newEnemy.save();
            res.status(201).json({
                message: "Enemy created successfully",
                enemy: savedEnemy
            });
        }
        catch (error) {
            console.error("Error creating enemy:", error);
            res.status(500).json({ message: "Failed to create enemy" });
        }
    }
    // Delete enemy
    async deleteEnemy(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({ message: "Enemy ID is required" });
                return;
            }
            const deletedEnemy = await enemy_model_1.Enemy.findByIdAndDelete(id);
            if (!deletedEnemy) {
                res.status(404).json({ message: "Enemy not found" });
                return;
            }
            res.status(200).json({
                message: "Enemy deleted successfully",
                enemy: deletedEnemy
            });
        }
        catch (error) {
            console.error("Error deleting enemy:", error);
            res.status(500).json({ message: "Failed to delete enemy" });
        }
    }
}
exports.EnemyController = EnemyController;
