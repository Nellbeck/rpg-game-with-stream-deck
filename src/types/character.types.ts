export enum CharacterClass {
  WARRIOR = 'warrior',
  MAGE = 'mage',
  ROGUE = 'rogue',
  CLERIC = 'cleric'
}

export interface Stats {
  strength: number;
  dexterity: number;
  intelligence: number;
  constitution: number;
  health: number;
  mana: number;
}