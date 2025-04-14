"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const character_controller_1 = require("../controllers/character.controller");
const router = express_1.default.Router();
const characterController = new character_controller_1.CharacterController();
// Create a new character
router.post('/', characterController.createCharacter.bind(characterController));
// Get all characters for a user
router.get('/user/:userId', characterController.getCharacters.bind(characterController));
// Get a single character by ID
router.get('/:characterId', characterController.getCharacter.bind(characterController));
// Update a character
router.put('/:characterId', characterController.updateCharacter.bind(characterController));
// Delete a character
router.delete('/:characterId', characterController.deleteCharacter.bind(characterController));
// Level up a character
router.post('/:characterId/levelup', characterController.levelUpCharacter.bind(characterController));
// Add experience to a character
router.post('/:characterId/experience', characterController.addExperience.bind(characterController));
exports.default = router;
