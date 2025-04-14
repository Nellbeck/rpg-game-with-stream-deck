import { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import { EnemyType, EnemyStats } from "../../../../src/types/enemy.types";

// Extend the existing types for what we need
interface Enemy {
  _id: string;
  name: string;
  type: EnemyType;
  stats: EnemyStats;
}

// Define the battle result interface
interface BattleResult {
  log: string[];
  characterWon: boolean;
  characterRemainingHP: number;
  enemyRemainingHP: number;
  experienceGained?: number;
  goldGained?: number;
  levelUp?: boolean;
  timestamp?: string;
  statsGained?: {
    strength?: number;
    dexterity?: number;
    intelligence?: number;
    constitution?: number;
    health?: number;
    mana?: number;
  };
}

@action({ UUID: "com.nellbeck.rpggame.combataction" })
export class CombatAction extends SingletonAction {
  // Store character ID as a constant for now
  private characterId = "67fbab623387492571e71c32";
  
  override async onKeyDown(ev: KeyDownEvent): Promise<void> {
    console.log('Combat action key pressed!');
   
    try {
      // First check for active enemies
      const checkResponse = await fetch("http://localhost:8000/enemies/active", {
        method: "GET"
      });
      
      if (!checkResponse.ok) {
        console.error("Failed to check for active enemies");
        return;
      }
      
      const enemies = await checkResponse.json() as Enemy[];
      
      if (!enemies || enemies.length === 0) {
        console.log("No active enemies found! Try spawning one first.");
        return;
      }
      
      // Use the first active enemy
      const enemyId = enemies[0]._id;
      const enemyName = enemies[0].name;
      
      console.log(`Starting battle with ${enemyName}...`);
      
      // Now start the battle
      const response = await fetch("http://localhost:8000/battle", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          characterId: this.characterId,
          enemyId: enemyId
        })
      });
     
      if (response.ok) {
        const result = await response.json() as BattleResult;
        console.log("Battle result:", result.characterWon ? "Victory!" : "Defeat!");
        console.log(`Character HP: ${result.characterRemainingHP}`);
        
        if (result.experienceGained) {
          console.log(`Gained ${result.experienceGained} XP and ${result.goldGained} gold!`);
        }
        
        if (result.levelUp) {
          console.log("🎉 LEVEL UP! 🎉");
        }
        
        // Log battle details for more visibility
        if (result.log && result.log.length > 0) {
          console.log("\nBattle Log:");
          result.log.forEach((entry: string) => console.log(entry));
        }
      } else {
        console.error("Failed to execute combat action");
      }
    } catch (error) {
      console.error("Error executing combat action:", error);
    }
  }
}