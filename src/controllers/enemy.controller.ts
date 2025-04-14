import { Request, Response } from "express";
import { Enemy } from "../models/enemy.model"; // Adjust path if needed
import { IEnemy } from "../models/enemy.model";

export const getEnemies = async (_req: Request, res: Response) => {
  try {
    const enemies: IEnemy[] = await Enemy.find();
    res.json(enemies);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch enemies." });
  }
};

export const getEnemyById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const enemy = await Enemy.findById(id);
    if (!enemy) return res.status(404).json({ error: "Enemy not found." });
    res.json(enemy);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch enemy." });
  }
};

export const createEnemy = async (req: Request, res: Response) => {
  const { type, name, level, stats } = req.body;

  try {
    const newEnemy = new Enemy({
      type,
      name,
      level,
      stats
    });

    const savedEnemy = await newEnemy.save();
    res.status(201).json(savedEnemy);
  } catch (error) {
    res.status(400).json({ error: "Failed to create enemy." });
  }
};

export const deleteEnemy = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deleted = await Enemy.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Enemy not found." });

    res.status(200).json({ message: "Enemy deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete enemy." });
  }
};

