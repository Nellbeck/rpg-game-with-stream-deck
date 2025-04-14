import { ICharacter } from "../models/character.model";
import { IEnemy } from "../models/enemy.model";
import { CharacterClass } from "../types/character.types";

export interface BattleResult {
  log: string[];
  characterWon: boolean;
  characterRemainingHP: number;
  enemyRemainingHP: number;
  experienceGained?: number;
  goldGained?: number;
  levelUp?: boolean;
  statsGained?: {
    strength?: number;
    dexterity?: number;
    intelligence?: number;
    constitution?: number;
    health?: number;
    mana?: number;
  };
}

// Calculate chance of critical hit based on dexterity
function calculateCritChance(dexterity: number): number {
  return Math.min(0.05 + (dexterity * 0.005), 0.25); // 5% base + 0.5% per DEX, max 25%
}

// Calculate dodge chance based on dexterity
function calculateDodgeChance(dexterity: number): number {
  return Math.min(0.03 + (dexterity * 0.003), 0.15); // 3% base + 0.3% per DEX, max 15%
}

// Calculate special ability damage based on class and stats
function calculateSpecialAttack(character: ICharacter): { damage: number, manaCost: number, description: string } {
  let damage = 0;
  let manaCost = 0;
  let description = '';
  
  switch(character.class) {
    case CharacterClass.WARRIOR:
      damage = character.stats.strength * 2;
      manaCost = 5;
      description = 'Mighty Slash';
      break;
    case CharacterClass.MAGE:
      damage = character.stats.intelligence * 2.5;
      manaCost = 15;
      description = 'Fireball';
      break;
    case CharacterClass.ROGUE:
      damage = character.stats.dexterity * 1.8;
      manaCost = 10;
      description = 'Precise Shot';
      break;
    case CharacterClass.CLERIC:
      damage = character.stats.intelligence * 1.5;
      manaCost = 8;
      description = 'Divine Smite';
      break;
    default:
      damage = character.stats.strength * 1.5;
      manaCost = 5;
      description = 'Power Attack';
  }
  
  return { damage: Math.round(damage), manaCost, description };
}

// Level up function to calculate and apply stat increases
function levelUp(character: ICharacter): { levelUp: boolean, statsGained: any } {
  const expNeeded = character.level * 100; // Simple formula: 100 XP per level
  
  if (character.experience >= expNeeded) {
    // Calculate stat increases based on class
    const statsGained: any = {};
    
    // Base stat increases for all classes
    statsGained.health = 10;
    statsGained.mana = 5;
    
    // Class-specific stat increases
    switch(character.class) {
      case CharacterClass.WARRIOR:
        statsGained.strength = 2;
        statsGained.constitution = 2;
        statsGained.dexterity = 1;
        statsGained.intelligence = 0;
        break;
      case CharacterClass.MAGE:
        statsGained.strength = 0;
        statsGained.constitution = 1;
        statsGained.dexterity = 1;
        statsGained.intelligence = 3;
        break;
      case CharacterClass.ROGUE:
        statsGained.strength = 1;
        statsGained.constitution = 1;
        statsGained.dexterity = 3;
        statsGained.intelligence = 0;
        break;
      case CharacterClass.CLERIC:
        statsGained.strength = 1;
        statsGained.constitution = 2;
        statsGained.dexterity = 0;
        statsGained.intelligence = 2;
        break;
      default:
        statsGained.strength = 1;
        statsGained.constitution = 1;
        statsGained.dexterity = 1;
        statsGained.intelligence = 1;
    }
    
    // Apply the increases
    character.level += 1;
    character.experience -= expNeeded;
    character.stats.strength += statsGained.strength;
    character.stats.constitution += statsGained.constitution;
    character.stats.dexterity += statsGained.dexterity;
    character.stats.intelligence += statsGained.intelligence;
    character.stats.health += statsGained.health;
    character.stats.mana += statsGained.mana;
    
    return { levelUp: true, statsGained };
  }
  
  return { levelUp: false, statsGained: null };
}

export function simulateCombat(character: ICharacter, enemy: IEnemy): BattleResult {
  const log: string[] = [];
  let charHP = character.stats.health;
  let charMana = character.stats.mana;
  let enemyHP = enemy.stats.health;
  
  const charAttack = character.stats.strength;
  const charDefense = character.stats.constitution;
  const charDexterity = character.stats.dexterity;
  const charIntelligence = character.stats.intelligence;
  
  const enemyAttack = enemy.stats.attack;
  const enemyDefense = enemy.stats.defense;
  
  const charCritChance = calculateCritChance(charDexterity);
  const charDodgeChance = calculateDodgeChance(charDexterity);
  
  // Enemy has simpler crit/dodge mechanics
  const enemyCritChance = 0.05; // 5% chance
  const enemyDodgeChance = 0.03; // 3% chance
  
  log.push(`Battle begins! ${character.name} (HP: ${charHP}, Mana: ${charMana}) vs ${enemy.name} (HP: ${enemyHP})`);
  
  let turn = 1;
  let specialAttackCooldown = 0;
  
  while (charHP > 0 && enemyHP > 0) {
    log.push(`\n--- Turn ${turn} ---`);
    
    // Check if character can use special attack (every 3 turns)
    const canUseSpecial = specialAttackCooldown === 0 && charMana >= 5;
    
    // Character attacks
    if (canUseSpecial) {
      const special = calculateSpecialAttack(character);
      
      if (charMana >= special.manaCost) {
        log.push(`${character.name} uses ${special.description}!`);
        
        // Check if enemy dodges
        if (Math.random() < enemyDodgeChance) {
          log.push(`${enemy.name} dodges the special attack!`);
        } else {
          enemyHP -= special.damage;
          charMana -= special.manaCost;
          log.push(`${special.description} hits for ${special.damage} damage! (${enemy.name} HP: ${Math.max(enemyHP, 0)}, ${character.name} Mana: ${charMana})`);
        }
        
        specialAttackCooldown = 3; // Reset cooldown
      } else {
        // Not enough mana, do regular attack
        performRegularAttack();
      }
    } else {
      performRegularAttack();
      // Reduce cooldown if > 0
      if (specialAttackCooldown > 0) {
        specialAttackCooldown--;
      }
    }
    
    // Function for regular attack logic to avoid duplication
    function performRegularAttack() {
      const isCrit = Math.random() < charCritChance;
      let charDamage = Math.max(1, charAttack - enemyDefense);
      
      if (isCrit) {
        charDamage = Math.floor(charDamage * 1.5);
        log.push(`${character.name} lands a critical hit!`);
      }
      
      // Check if enemy dodges
      if (Math.random() < enemyDodgeChance) {
        log.push(`${enemy.name} dodges the attack!`);
      } else {
        enemyHP -= charDamage;
        log.push(`${character.name} attacks ${enemy.name} for ${charDamage} damage (${enemy.name} HP: ${Math.max(enemyHP, 0)})`);
      }
    }
    
    // Check if enemy is defeated
    if (enemyHP <= 0) break;
    
    // Enemy attacks
    const isEnemyCrit = Math.random() < enemyCritChance;
    let enemyDamage = Math.max(1, enemyAttack - charDefense);
    
    if (isEnemyCrit) {
      enemyDamage = Math.floor(enemyDamage * 1.5);
      log.push(`${enemy.name} lands a critical hit!`);
    }
    
    // Check if character dodges
    if (Math.random() < charDodgeChance) {
      log.push(`${character.name} dodges the attack!`);
    } else {
      charHP -= enemyDamage;
      log.push(`${enemy.name} attacks ${character.name} for ${enemyDamage} damage (${character.name} HP: ${Math.max(charHP, 0)})`);
    }
    
    // Regenerate a small amount of mana each turn
    const manaRegen = Math.floor(charIntelligence / 10) + 1;
    charMana = Math.min(character.stats.mana, charMana + manaRegen);
    
    if (manaRegen > 1) {
      log.push(`${character.name} regenerates ${manaRegen} mana (Mana: ${charMana})`);
    }
    
    turn++;
  }
  
  // Battle results
  const characterWon = charHP > 0;
  const experienceGained = characterWon ? enemy.stats.experienceReward : 0;
  const goldGained = characterWon ? enemy.stats.goldReward : 0;
  
  if (characterWon) {
    log.push(`\n${character.name} defeated ${enemy.name}! Gained ${experienceGained} XP and ${goldGained} gold.`);
    
    // Add experience to character
    character.experience += experienceGained;
    character.gold += goldGained;
    
    // Check for level up
    const levelUpResult = levelUp(character);
    
    if (levelUpResult.levelUp) {
      log.push(`\n🎉 ${character.name} leveled up to level ${character.level}! 🎉`);
      log.push(`Stats increased: HP +${levelUpResult.statsGained.health}, Mana +${levelUpResult.statsGained.mana}, ` +
               `STR +${levelUpResult.statsGained.strength}, DEX +${levelUpResult.statsGained.dexterity}, ` +
               `INT +${levelUpResult.statsGained.intelligence}, CON +${levelUpResult.statsGained.constitution}`);
      
      return {
        log,
        characterWon,
        characterRemainingHP: charHP,
        enemyRemainingHP: 0,
        experienceGained,
        goldGained,
        levelUp: true,
        statsGained: levelUpResult.statsGained
      };
    }
  } else {
    log.push(`\n${character.name} was defeated by ${enemy.name}...`);
  }

console.log("=== FULL COMBAT LOG ===");
log.forEach(line => console.log(line));
console.log("=== END OF LOG ===");

  
  return {
    log,
    characterWon,
    characterRemainingHP: Math.max(charHP, 0),
    enemyRemainingHP: Math.max(enemyHP, 0),
    experienceGained,
    goldGained
  };
}