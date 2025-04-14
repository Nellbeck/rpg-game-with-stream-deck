import mongoose, { Document, Schema } from 'mongoose';
import { CharacterClass, Stats } from '../types/character.types';

export interface ICharacter extends Document {
  userId: string;
  name: string;
  class: CharacterClass;
  level: number;
  experience: number;
  stats: Stats;
  gold: number;
  createdAt: Date;
  updatedAt: Date;
}

const CharacterSchema = new Schema<ICharacter>({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  class: { 
    type: String, 
    enum: Object.values(CharacterClass),
    required: true 
  },
  level: { type: Number, default: 1 },
  experience: { type: Number, default: 0 },
  stats: {
    strength: { type: Number, required: true },
    dexterity: { type: Number, required: true },
    intelligence: { type: Number, required: true },
    constitution: { type: Number, required: true },
    health: { type: Number, required: true },
    mana: { type: Number, required: true }
  },
  gold: { type: Number, default: 100 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Character = mongoose.model<ICharacter>('Character', CharacterSchema);