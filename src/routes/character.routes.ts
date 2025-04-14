import express from 'express';
import { CharacterController } from '../controllers/character.controller';

const router = express.Router();
const characterController = new CharacterController();

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

export default router;