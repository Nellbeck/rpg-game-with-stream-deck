import mongoose, { Document, Schema } from 'mongoose';

export interface IInventoryItem {
  itemId: mongoose.Types.ObjectId;
  quantity: number;
  isEquipped: boolean;
}

export interface IInventory extends Document {
  characterId: mongoose.Types.ObjectId;
  items: IInventoryItem[];
  gold: number;
  maxItems: number;
  capacity: number;
  createdAt: Date;
  updatedAt: Date;
}

const InventorySchema = new Schema<IInventory>({
  characterId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Character',
    required: true,
    unique: true
  },
  items: [{
    itemId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Item',
      required: true
    },
    quantity: { 
      type: Number, 
      required: true, 
      min: 1 
    },
    isEquipped: { 
      type: Boolean, 
      default: false 
    }
  }],
  gold: { type: Number, default: 0, min: 0 },
  capacity: { type: Number, default: 20 },
  maxItems: { type: Number, default: 20 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Inventory = mongoose.model<IInventory>('Inventory', InventorySchema);