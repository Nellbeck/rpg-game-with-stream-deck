// src/controllers/inventory.controller.ts
import { Request, Response } from 'express';
import { Inventory } from '../models/inventory.model';
import { Item } from '../models/item.model';
import mongoose from 'mongoose';

export class InventoryController {
  // Get character inventory
  async getInventory(req: Request, res: Response): Promise<void> {
    try {
      const { characterId } = req.params;
      
      if (!characterId) {
        res.status(400).json({ message: 'Character ID is required' });
        return;
      }
      
      const inventory = await Inventory.findOne({ characterId }).populate('items.itemId');
      
      if (!inventory) {
        res.status(404).json({ message: 'Inventory not found' });
        return;
      }
      
      res.status(200).json(inventory);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      res.status(500).json({ message: 'Failed to fetch inventory' });
    }
  }
  
  // Add item to inventory
  async addItem(req: Request, res: Response): Promise<void> {
    try {
      const { characterId } = req.params;
      const { itemId, quantity = 1 } = req.body;
      
      if (!characterId || !itemId) {
        res.status(400).json({ message: 'Character ID and Item ID are required' });
        return;
      }
      
      // Check if item exists
      const item = await Item.findById(itemId);
      if (!item) {
        res.status(404).json({ message: 'Item not found' });
        return;
      }
      
      const inventory = await Inventory.findOne({ characterId });
      
      if (!inventory) {
        res.status(404).json({ message: 'Inventory not found' });
        return;
      }
      
      // Check inventory capacity
      if (inventory.items.length >= inventory.capacity) {
        res.status(400).json({ message: 'Inventory is full' });
        return;
      }
      
      // Check if item already exists in inventory
      const existingItemIndex = inventory.items.findIndex(
        item => item.itemId.toString() === itemId
      );
      
      if (existingItemIndex > -1) {
        // Increment quantity
        inventory.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        inventory.items.push({
          itemId: new mongoose.Types.ObjectId(itemId),
          quantity,
          isEquipped: false
        });
      }
      
      inventory.updatedAt = new Date();
      await inventory.save();
      
      res.status(200).json({
        message: 'Item added to inventory',
        inventory
      });
    } catch (error) {
      console.error('Error adding item to inventory:', error);
      res.status(500).json({ message: 'Failed to add item to inventory' });
    }
  }
  
  // Remove item from inventory
  async removeItem(req: Request, res: Response): Promise<void> {
    try {
      const { characterId, itemId } = req.params;
      const { quantity = 1 } = req.body;
      
      if (!characterId || !itemId) {
        res.status(400).json({ message: 'Character ID and Item ID are required' });
        return;
      }
      
      const inventory = await Inventory.findOne({ characterId });
      
      if (!inventory) {
        res.status(404).json({ message: 'Inventory not found' });
        return;
      }
      
      // Find item in inventory
      const itemIndex = inventory.items.findIndex(
        item => item.itemId.toString() === itemId
      );
      
      if (itemIndex === -1) {
        res.status(404).json({ message: 'Item not found in inventory' });
        return;
      }
      
      // Remove quantity
      if (inventory.items[itemIndex].quantity <= quantity) {
        // Remove item entirely
        inventory.items.splice(itemIndex, 1);
      } else {
        // Decrease quantity
        inventory.items[itemIndex].quantity -= quantity;
      }
      
      inventory.updatedAt = new Date();
      await inventory.save();
      
      res.status(200).json({
        message: 'Item removed from inventory',
        inventory
      });
    } catch (error) {
      console.error('Error removing item from inventory:', error);
      res.status(500).json({ message: 'Failed to remove item from inventory' });
    }
  }
  
  // Equip/Unequip item
  async toggleEquipItem(req: Request, res: Response): Promise<void> {
    try {
      const { characterId, itemId } = req.params;
      
      if (!characterId || !itemId) {
        res.status(400).json({ message: 'Character ID and Item ID are required' });
        return;
      }
      
      const inventory = await Inventory.findOne({ characterId });
      
      if (!inventory) {
        res.status(404).json({ message: 'Inventory not found' });
        return;
      }
      
      // Find item in inventory
      const itemIndex = inventory.items.findIndex(
        item => item.itemId.toString() === itemId
      );
      
      if (itemIndex === -1) {
        res.status(404).json({ message: 'Item not found in inventory' });
        return;
      }
      
      // Toggle equipped status
      inventory.items[itemIndex].isEquipped = !inventory.items[itemIndex].isEquipped;
      
      inventory.updatedAt = new Date();
      await inventory.save();
      
      res.status(200).json({
        message: `Item ${inventory.items[itemIndex].isEquipped ? 'equipped' : 'unequipped'}`,
        inventory
      });
    } catch (error) {
      console.error('Error toggling item equipped status:', error);
      res.status(500).json({ message: 'Failed to toggle item equipped status' });
    }
  }
}