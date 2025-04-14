import { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";

@action({ UUID: "com.nellbeck.rpggame.createcharacter" })
export class CreateCharacterAction extends SingletonAction {
  override async onKeyDown(ev: KeyDownEvent): Promise<void> {
    console.log('Create character key pressed!');
    
    try {
      // Creating a warrior character via the bridge
      const response = await fetch("http://localhost:8000/create/warrior", {
        method: "POST"
      });
      
      // Let's log the full response for debugging
      const responseText = await response.text();
      console.log("Response:", responseText);
      
      console.log("Character creation request sent!");
    } catch (error) {
      console.error("Error creating character:", error);
    }
  }
}