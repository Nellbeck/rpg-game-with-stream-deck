"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacterController = void 0;
const character_model_1 = require("../models/character.model");
const character_types_1 = require("../types/character.types");
const inventory_model_1 = require("../models/inventory.model");
class CharacterController {
    // Create a new character
    async createCharacter(req, res) {
        console.log('Received request to create character:', req.body);
        try {
            const { name, characterClass, userId } = req.body;
            if (!name || !characterClass || !userId) {
                res.status(400).json({ message: 'Name, class, and userId are required' });
                return;
            }
            if (!Object.values(character_types_1.CharacterClass).includes(characterClass)) {
                res.status(400).json({ message: 'Invalid character class' });
                return;
            }
            const stats = this.generateInitialStats(characterClass);
            const character = new character_model_1.Character({
                userId,
                name,
                class: characterClass,
                stats
            });
            await character.save();
            // Create inventory for the new character
            const inventory = new inventory_model_1.Inventory({
                characterId: character._id,
                gold: character.gold, // Initial gold from character
                items: [], // Empty inventory to start
                capacity: 20
            });
            await inventory.save();
            res.status(201).json({
                message: 'Character created successfully',
                character,
                inventory
            });
        }
        catch (error) {
            console.error('Error creating character:', error);
            res.status(500).json({ message: 'Failed to create character' });
        }
    }
    // Get all characters for a user
    async getCharacters(req, res) {
        try {
            const { userId } = req.params;
            if (!userId) {
                res.status(400).json({ message: 'User ID is required' });
                return;
            }
            const characters = await character_model_1.Character.find({ userId });
            res.status(200).json(characters);
        }
        catch (error) {
            console.error('Error fetching characters:', error);
            res.status(500).json({ message: 'Failed to fetch characters' });
        }
    }
    // Update a character
    async updateCharacter(req, res) {
        try {
            const { characterId } = req.params;
            const updateData = req.body;
            if (!characterId) {
                res.status(400).json({ message: 'Character ID is required' });
                return;
            }
            // Prevent updating sensitive fields
            delete updateData._id;
            delete updateData.userId;
            delete updateData.createdAt;
            // Update the timestamp
            updateData.updatedAt = new Date();
            const updatedCharacter = await character_model_1.Character.findByIdAndUpdate(characterId, updateData, { new: true, runValidators: true });
            if (!updatedCharacter) {
                res.status(404).json({ message: 'Character not found' });
                return;
            }
            res.status(200).json({
                message: 'Character updated successfully',
                character: updatedCharacter
            });
        }
        catch (error) {
            console.error('Error updating character:', error);
            res.status(500).json({ message: 'Failed to update character' });
        }
    }
    // Delete a character
    async deleteCharacter(req, res) {
        try {
            const { characterId } = req.params;
            if (!characterId) {
                res.status(400).json({ message: 'Character ID is required' });
                return;
            }
            const deletedCharacter = await character_model_1.Character.findByIdAndDelete(characterId);
            if (!deletedCharacter) {
                res.status(404).json({ message: 'Character not found' });
                return;
            }
            res.status(200).json({
                message: 'Character deleted successfully',
                character: deletedCharacter
            });
        }
        catch (error) {
            console.error('Error deleting character:', error);
            res.status(500).json({ message: 'Failed to delete character' });
        }
    }
    // Get a single character by ID
    async getCharacter(req, res) {
        try {
            const { characterId } = req.params;
            if (!characterId) {
                res.status(400).json({ message: 'Character ID is required' });
                return;
            }
            const character = await character_model_1.Character.findById(characterId);
            if (!character) {
                res.status(404).json({ message: 'Character not found' });
                return;
            }
            res.status(200).json(character);
        }
        catch (error) {
            console.error('Error fetching character:', error);
            res.status(500).json({ message: 'Failed to fetch character' });
        }
    }
    // Helper method to generate initial stats based on character class
    generateInitialStats(characterClass) {
        switch (characterClass) {
            case character_types_1.CharacterClass.WARRIOR:
                return {
                    strength: 10,
                    dexterity: 6,
                    intelligence: 4,
                    constitution: 8,
                    health: 100,
                    mana: 20
                };
            case character_types_1.CharacterClass.MAGE:
                return {
                    strength: 3,
                    dexterity: 5,
                    intelligence: 12,
                    constitution: 4,
                    health: 60,
                    mana: 100
                };
            case character_types_1.CharacterClass.ROGUE:
                return {
                    strength: 5,
                    dexterity: 12,
                    intelligence: 6,
                    constitution: 5,
                    health: 70,
                    mana: 40
                };
            case character_types_1.CharacterClass.CLERIC:
                return {
                    strength: 6,
                    dexterity: 5,
                    intelligence: 8,
                    constitution: 7,
                    health: 80,
                    mana: 80
                };
            default:
                return {
                    strength: 5,
                    dexterity: 5,
                    intelligence: 5,
                    constitution: 5,
                    health: 50,
                    mana: 50
                };
        }
    }
    // Add this method to src/controllers/character.controller.ts
    // Level up a character
    async levelUpCharacter(req, res) {
        try {
            const { characterId } = req.params;
            if (!characterId) {
                res.status(400).json({ message: 'Character ID is required' });
                return;
            }
            const character = await character_model_1.Character.findById(characterId);
            if (!character) {
                res.status(404).json({ message: 'Character not found' });
                return;
            }
            // Check if character has enough experience to level up
            const expRequiredForLevelUp = this.calculateRequiredExp(character.level);
            if (character.experience < expRequiredForLevelUp) {
                res.status(400).json({
                    message: 'Not enough experience to level up',
                    currentExp: character.experience,
                    requiredExp: expRequiredForLevelUp
                });
                return;
            }
            // Perform level up
            character.level += 1;
            character.experience -= expRequiredForLevelUp;
            // Increase stats based on character class
            this.increaseStats(character);
            // Save changes
            character.updatedAt = new Date();
            await character.save();
            res.status(200).json({
                message: 'Character leveled up successfully',
                character
            });
        }
        catch (error) {
            console.error('Error during level up:', error);
            res.status(500).json({ message: 'Failed to level up character' });
        }
    }
    // Helper method to calculate required experience for next level
    calculateRequiredExp(currentLevel) {
        // Simple formula: level * 100
        return currentLevel * 100;
    }
    // Helper method to increase stats during level up
    increaseStats(character) {
        switch (character.class) {
            case character_types_1.CharacterClass.WARRIOR:
                character.stats.strength += 2;
                character.stats.dexterity += 1;
                character.stats.constitution += 2;
                character.stats.health += 15;
                character.stats.mana += 5;
                break;
            case character_types_1.CharacterClass.MAGE:
                character.stats.intelligence += 3;
                character.stats.dexterity += 1;
                character.stats.constitution += 1;
                character.stats.health += 8;
                character.stats.mana += 20;
                break;
            case character_types_1.CharacterClass.ROGUE:
                character.stats.dexterity += 3;
                character.stats.strength += 1;
                character.stats.intelligence += 1;
                character.stats.health += 10;
                character.stats.mana += 8;
                break;
            case character_types_1.CharacterClass.CLERIC:
                character.stats.intelligence += 2;
                character.stats.constitution += 2;
                character.stats.strength += 1;
                character.stats.health += 12;
                character.stats.mana += 15;
                break;
        }
    }
    // Add this method to src/controllers/character.controller.ts
    // Add experience to a character
    async addExperience(req, res) {
        try {
            const { characterId } = req.params;
            const { amount } = req.body;
            if (!characterId) {
                res.status(400).json({ message: 'Character ID is required' });
                return;
            }
            if (!amount || isNaN(amount) || amount <= 0) {
                res.status(400).json({ message: 'Valid experience amount is required' });
                return;
            }
            const character = await character_model_1.Character.findById(characterId);
            if (!character) {
                res.status(404).json({ message: 'Character not found' });
                return;
            }
            // Add experience
            character.experience += Number(amount);
            character.updatedAt = new Date();
            await character.save();
            // Check if character can level up
            const expRequiredForLevelUp = this.calculateRequiredExp(character.level);
            const canLevelUp = character.experience >= expRequiredForLevelUp;
            res.status(200).json({
                message: 'Experience added successfully',
                character,
                canLevelUp,
                expRequiredForLevelUp
            });
        }
        catch (error) {
            console.error('Error adding experience:', error);
            res.status(500).json({ message: 'Failed to add experience' });
        }
    }
}
exports.CharacterController = CharacterController;
