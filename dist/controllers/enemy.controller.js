"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEnemy = exports.createEnemy = exports.getEnemyById = exports.getEnemies = void 0;
const enemy_model_1 = require("../models/enemy.model"); // Adjust path if needed
const getEnemies = async (_req, res) => {
    try {
        const enemies = await enemy_model_1.Enemy.find();
        res.json(enemies);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch enemies." });
    }
};
exports.getEnemies = getEnemies;
const getEnemyById = async (req, res) => {
    const { id } = req.params;
    try {
        const enemy = await enemy_model_1.Enemy.findById(id);
        if (!enemy)
            return res.status(404).json({ error: "Enemy not found." });
        res.json(enemy);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch enemy." });
    }
};
exports.getEnemyById = getEnemyById;
const createEnemy = async (req, res) => {
    const { type, name, level, stats } = req.body;
    try {
        const newEnemy = new enemy_model_1.Enemy({
            type,
            name,
            level,
            stats
        });
        const savedEnemy = await newEnemy.save();
        res.status(201).json(savedEnemy);
    }
    catch (error) {
        res.status(400).json({ error: "Failed to create enemy." });
    }
};
exports.createEnemy = createEnemy;
const deleteEnemy = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await enemy_model_1.Enemy.findByIdAndDelete(id);
        if (!deleted)
            return res.status(404).json({ error: "Enemy not found." });
        res.status(200).json({ message: "Enemy deleted successfully." });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to delete enemy." });
    }
};
exports.deleteEnemy = deleteEnemy;
