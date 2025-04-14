export enum ItemType {
    WEAPON = 'weapon',
    ARMOR = 'armor',
    POTION = 'potion',
    SCROLL = 'scroll',
    TREASURE = 'treasure',
    QUEST_ITEM = 'quest_item'
  }
  
  export enum ItemRarity {
    COMMON = 'common',
    UNCOMMON = 'uncommon',
    RARE = 'rare',
    EPIC = 'epic',
    LEGENDARY = 'legendary'
  }
  
  export interface ItemStats {
    damage?: number;
    armor?: number;
    healing?: number;
    strength?: number;
    dexterity?: number;
    intelligence?: number;
    constitution?: number;
  }