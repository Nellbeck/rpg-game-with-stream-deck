  import mongoose, { Document, Schema } from 'mongoose';
  import { ItemType, ItemRarity, ItemStats } from '../types/item.types';
  
  export interface IItem extends Document {
    name: string;
    description: string;
    type: ItemType;
    rarity: ItemRarity;
    value: number;
    stats: ItemStats;
    requiredLevel: number;
    createdAt: Date;
    updatedAt: Date;
  }
  
  const ItemSchema = new Schema<IItem>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    type: { 
      type: String, 
      enum: Object.values(ItemType),
      required: true 
    },
    rarity: { 
      type: String, 
      enum: Object.values(ItemRarity),
      default: ItemRarity.COMMON 
    },
    value: { type: Number, required: true, min: 0 },
    stats: {
      damage: { type: Number },
      armor: { type: Number },
      healing: { type: Number },
      strength: { type: Number },
      dexterity: { type: Number },
      intelligence: { type: Number },
      constitution: { type: Number }
    },
    requiredLevel: { type: Number, default: 1, min: 1 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  });
  
  export const Item = mongoose.model<IItem>('Item', ItemSchema);