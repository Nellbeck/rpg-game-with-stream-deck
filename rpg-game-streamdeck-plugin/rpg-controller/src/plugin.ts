import StreamDeck, { LogLevel } from "@elgato/streamdeck";
import { CreateCharacterAction } from "./actions/create-character";
import { SpawnEnemyAction } from "./actions/spawn-enemy";
import { CombatAction } from "./actions/combat-action";
import { HealAction } from "./actions/heal-action";

// Create a single Stream Deck instance
const streamDeck = StreamDeck;

// Enable "trace" logging for debugging
streamDeck.logger.setLevel(LogLevel.TRACE);

// Register all of our actions
streamDeck.actions.registerAction(new CreateCharacterAction());
streamDeck.actions.registerAction(new SpawnEnemyAction());
streamDeck.actions.registerAction(new CombatAction());
streamDeck.actions.registerAction(new HealAction());

// Connect to the Stream Deck
streamDeck.connect();