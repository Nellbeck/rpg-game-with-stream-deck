import mongoose, { Document, Schema } from "mongoose";
import { EnemyType, EnemyStats } from "../types/enemy.types";

export interface IEnemy extends Document {
  type: EnemyType;
  name: string;
  level: number;
  stats: EnemyStats;
  createdAt: Date;
  updatedAt: Date;
}

const EnemySchema = new Schema<IEnemy>({
  type: {
    type: String,
    enum: Object.values(EnemyType),
    required: true
  },
  name: { type: String, required: true },
  level: { type: Number, required: true },
  stats: {
    health: { type: Number, required: true },
    attack: { type: Number, required: true },
    defense: { type: Number, required: true },
    experienceReward: { type: Number, required: true },
    goldReward: { type: Number, required: true }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Enemy = mongoose.model<IEnemy>("Enemy", EnemySchema);

