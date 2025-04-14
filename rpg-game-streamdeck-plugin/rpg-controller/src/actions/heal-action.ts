import { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";

@action({ UUID: "com.nellbeck.rpggame.healaction" })
export class HealAction extends SingletonAction {
  override async onKeyDown(ev: KeyDownEvent): Promise<void> {
    console.log('Heal action key pressed!');
   
    try {
      // If you choose option 1 above (changing combat-action to use POST):
      const response = await fetch("http://localhost:8000/heal", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          characterId: "67fbab623387492571e71c32", // Replace with actual character ID or get from settings
          healAmount: 20 // Default healing amount or get from settings
        })
      });
      
      if (response.ok) {
        console.log("Heal action executed!");
      } else {
        console.error("Failed to execute heal action");
      }
    } catch (error) {
      console.error("Error executing heal action:", error);
    }
  }
}