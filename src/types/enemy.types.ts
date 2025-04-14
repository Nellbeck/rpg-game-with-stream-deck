export enum EnemyType {
    GOBLIN = "goblin",
    ORC = "orc",
    TROLL = "troll",
    UNDEAD = "undead",
    DRAGON = "dragon"
  }
  
  export interface EnemyStats {
    health: number;
    attack: number;
    defense: number;
    experienceReward: number;
    goldReward: number;
  }
  