"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inventory_controller_1 = require("../controllers/inventory.controller");
const router = express_1.default.Router();
const inventoryController = new inventory_controller_1.InventoryController();
// Get character inventory
router.get('/character/:characterId', inventoryController.getInventory.bind(inventoryController));
// Add item to inventory
router.post('/character/:characterId/item', inventoryController.addItem.bind(inventoryController));
// Remove item from inventory
router.delete('/character/:characterId/item/:itemId', inventoryController.removeItem.bind(inventoryController));
// Toggle equip/unequip item
router.put('/character/:characterId/item/:itemId/equip', inventoryController.toggleEquipItem.bind(inventoryController));
exports.default = router;
