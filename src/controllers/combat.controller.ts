import { Request, Response } from "express";
import { Character, ICharacter } from "../models/character.model";
import { Enemy, IEnemy } from "../models/enemy.model";
import { simulateCombat } from "../utils/combat.utils";

export class CombatController {
  async battle(req: Request, res: Response): Promise<void> {
    const { characterId, enemyId } = req.body;
    
    try {
      const character = await Character.findById(characterId);
      const enemy = await Enemy.findById(enemyId);
      
      if (!character || !enemy) {
        res.status(404).json({ error: "Character or enemy not found." });
        return;
      }
      
      // Simulate the combat
      const battleResult = simulateCombat(character, enemy);
      
      // If character won, update their stats and save
      if (battleResult.characterWon) {
        // Experience and gold are already updated in the simulateCombat function
        
        // Save the character with updated stats
        await character.save();
        
        // Remove or mark the enemy as defeated
        if (enemy.type !== 'dragon') {  // Don't delete dragon enemies
          await Enemy.findByIdAndDelete(enemyId);
        } else {
          enemy.stats.health = 0; // Mark as defeated
          await enemy.save();
        }
      } else {
        // Character lost
        // You could implement some penalty here if desired
        // For example: lose a percentage of gold
        
        // Restore enemy health for future battles
        enemy.stats.health = enemy.stats.health;
        await enemy.save();
      }
      
      res.json(battleResult);
    } catch (error) {
      console.error("Combat error:", error);
      res.status(500).json({ error: "Combat simulation failed." });
    }
  }
  
  // New method for handling character healing
  async heal(req: Request, res: Response): Promise<void> {
    const { characterId, amount } = req.body;
    
    try {
      const character = await Character.findById(characterId);
      
      if (!character) {
        res.status(404).json({ error: "Character not found." });
        return;
      }
      
      // Calculate healing cost
      const healCost = amount * 2; // 2 gold per HP
      
      if (character.gold < healCost) {
        res.status(400).json({ error: "Not enough gold for healing." });
        return;
      }
      
      // Apply healing
      character.stats.health = Math.min(
        character.stats.health + amount,
        character.level * 10 + 50 // Example max health formula
      );
      character.gold -= healCost;
      
      await character.save();
      
      res.json({
        message: `Healed ${amount} HP for ${healCost} gold.`,
        currentHealth: character.stats.health,
        remainingGold: character.gold
      });
    } catch (error) {
      console.error("Healing error:", error);
      res.status(500).json({ error: "Healing failed." });
    }
  }
}

