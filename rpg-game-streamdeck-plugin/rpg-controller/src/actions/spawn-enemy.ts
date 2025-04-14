import { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";

@action({ UUID: "com.nellbeck.rpggame.spawnenemy" })
export class SpawnEnemyAction extends SingletonAction {
  override async onKeyDown(ev: KeyDownEvent): Promise<void> {
    console.log('Spawn enemy key pressed!');
    
    try {
      const response = await fetch("http://localhost:8000/spawn/goblin", {
        method: "GET"
      });
      
      if (response.ok) {
        console.log("Enemy spawned!");
      } else {
        console.error("Failed to spawn enemy");
      }
    } catch (error) {
      console.error("Error spawning enemy:", error);
    }
  }
}