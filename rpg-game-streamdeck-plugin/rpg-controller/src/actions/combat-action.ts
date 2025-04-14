import { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";

@action({ UUID: "com.nellbeck.rpggame.combataction" })
export class CombatAction extends SingletonAction {
  override async onKeyDown(ev: KeyDownEvent): Promise<void> {
    console.log('Combat action key pressed!');
   
    try {
      const response = await fetch("http://localhost:8000/battle", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          characterId: "67fbab623387492571e71c32", 
          enemyId: "67fbad0d3387492571e71c36" 
        })
      });
     
      if (response.ok) {
        console.log("Combat action executed!");
      } else {
        console.error("Failed to execute combat action");
      }
    } catch (error) {
      console.error("Error executing combat action:", error);
    }
  }
}