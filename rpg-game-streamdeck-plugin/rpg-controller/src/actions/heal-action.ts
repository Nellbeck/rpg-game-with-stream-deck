import { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";

// Define interfaces for the API response
interface HealResult {
  message: string;
  currentHealth: number;
  remainingGold: number;
}

interface ErrorResponse {
  error: string;
}

@action({ UUID: "com.nellbeck.rpggame.healaction" })
export class HealAction extends SingletonAction {
  // Store character ID as a constant for now (same as in combat-action)
  private characterId = "67fbab623387492571e71c32";
  private healAmount = 20; // Default healing amount
  
  override async onKeyDown(ev: KeyDownEvent): Promise<void> {
    console.log('Heal action key pressed!');
   
    try {
      const response = await fetch("http://localhost:8000/heal", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          characterId: this.characterId,
          amount: this.healAmount
        })
      });
      
      if (response.ok) {
        const result = await response.json() as HealResult;
        console.log(`Healing successful: ${result.message}`);
        console.log(`Current HP: ${result.currentHealth}, Gold: ${result.remainingGold}`);
      } else {
        const errorData = await response.json() as ErrorResponse;
        console.error(`Failed to execute heal action: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error executing heal action:", error);
    }
  }
}