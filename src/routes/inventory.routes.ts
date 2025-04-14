import express from 'express';
import { InventoryController } from '../controllers/inventory.controller';

const router = express.Router();
const inventoryController = new InventoryController();

// Get character inventory
router.get('/character/:characterId', inventoryController.getInventory.bind(inventoryController));

// Add item to inventory
router.post('/character/:characterId/item', inventoryController.addItem.bind(inventoryController));

// Remove item from inventory
router.delete('/character/:characterId/item/:itemId', inventoryController.removeItem.bind(inventoryController));

// Toggle equip/unequip item
router.put('/character/:characterId/item/:itemId/equip', inventoryController.toggleEquipItem.bind(inventoryController));

export default router;