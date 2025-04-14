const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 8000;
const GAME_API_URL = 'http://localhost:3000/api';

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Route for creating a character
app.post('/create/:type', async (req, res) => {
  console.log(`Bridge received request to create ${req.params.type} character`);
  
  try {
    // Construct proper character creation request
    const characterData = {
      name: `Stream Deck ${req.params.type}`,
      characterClass: req.params.type, 
      userId: "stream-deck-user"
    };
    
    console.log('Sending to API:', characterData);
    
    const response = await fetch(`${GAME_API_URL}/characters`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(characterData)
    });
    
    // Handle response
    const responseText = await response.text();
    console.log('Response status:', response.status);
    console.log('Response body (first 100 chars):', responseText.substring(0, 100));
    
    try {
      // Try to parse as JSON
      const responseData = JSON.parse(responseText);
      res.status(response.status).json(responseData);
    } catch (e) {
      // If not valid JSON, send as is
      res.status(response.status).send(responseText);
    }
  } catch (error) {
    console.error('Error forwarding create character request:', error);
    res.status(500).json({ error: 'Failed to create character' });
  }
});

app.get('/spawn/:type', async (req, res) => {
  console.log(`Bridge received request to spawn ${req.params.type}`);
  
  try {
    // Get enemy type from request params
    const enemyType = req.params.type.toLowerCase();
    
    // Generate stats based on enemy type
    let stats = generateEnemyStats(enemyType);
    
    // Construct enemy data
    const enemyData = {
      type: enemyType,
      name: `${enemyType.charAt(0).toUpperCase() + enemyType.slice(1)} Minion`,
      level: 1,
      stats: stats
    };
    
    console.log('Sending to API:', enemyData);
    
    const response = await fetch(`${GAME_API_URL}/enemies/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(enemyData)
    });
    
    // Handle response
    const responseText = await response.text();
    console.log('Response status:', response.status);
    console.log('Response body (first 100 chars):', responseText.substring(0, 100));
    
    try {
      // Try to parse as JSON
      const responseData = JSON.parse(responseText);
      res.status(response.status).json(responseData);
    } catch (e) {
      // If not valid JSON, send as is
      res.status(response.status).send(responseText);
    }
  } catch (error) {
    console.error('Error forwarding spawn enemy request:', error);
    res.status(500).json({ error: 'Failed to spawn enemy' });
  }
});

// Helper function to generate stats based on enemy type
function generateEnemyStats(enemyType) {
  switch (enemyType) {
    case 'goblin':
      return {
        health: 30,
        attack: 5,
        defense: 3,
        experienceReward: 10,
        goldReward: 5
      };
    case 'orc':
      return {
        health: 50,
        attack: 8,
        defense: 5,
        experienceReward: 15,
        goldReward: 10
      };
    case 'troll':
      return {
        health: 80,
        attack: 12,
        defense: 8,
        experienceReward: 25,
        goldReward: 20
      };
    case 'undead':
      return {
        health: 40,
        attack: 7,
        defense: 4,
        experienceReward: 12,
        goldReward: 8
      };
    case 'dragon':
      return {
        health: 200,
        attack: 20,
        defense: 15,
        experienceReward: 100,
        goldReward: 50
      };
    default:
      return {
        health: 20,
        attack: 3,
        defense: 2,
        experienceReward: 5,
        goldReward: 3
      };
  }
}

app.post('/battle', async (req, res) => {
  console.log(`Bridge received request to start battle`);
  
  try {
    // Get characterId and enemyId from request
    const { characterId, enemyId } = req.body;
    
    if (!characterId || !enemyId) {
      return res.status(400).json({ error: 'Missing characterId or enemyId' });
    }
    
    const response = await fetch(`${GAME_API_URL}/combat/battle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ characterId, enemyId })
    });
    
    // Handle response
    const responseText = await response.text();
    console.log('Response status:', response.status);
    console.log('Response body (first 100 chars):', responseText.substring(0, 100));
    
    try {
      // Try to parse as JSON
      const responseData = JSON.parse(responseText);
      res.status(response.status).json(responseData);
    } catch (e) {
      // If not valid JSON, send as is
      res.status(response.status).send(responseText);
    }
  } catch (error) {
    console.error('Error forwarding battle request:', error);
    res.status(500).json({ error: 'Failed to process battle' });
  }
});

// Route to heal character
app.post('/heal', async (req, res) => {
  console.log(`Bridge received request to heal character`);
 
  try {
    // Get characterId and healAmount from request
    const { characterId, healAmount } = req.body;
   
    if (!characterId) {
      return res.status(400).json({ error: 'Missing characterId' });
    }
   
    const amount = healAmount || 20; // Default to 20 if not provided
   
    console.log(`Healing character ${characterId} for ${amount} HP`);
   
    const response = await fetch(`${GAME_API_URL}/combat/heal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ characterId, amount })
    });
   
    // Handle response same way as battle
    const responseText = await response.text();
    console.log('Response status:', response.status);
    console.log('Response body (first 100 chars):', responseText.substring(0, 100));
   
    try {
      // Try to parse as JSON
      const responseData = JSON.parse(responseText);
      res.status(response.status).json(responseData);
    } catch (e) {
      // If not valid JSON, send as is
      res.status(response.status).send(responseText);
    }
  } catch (error) {
    console.error('Error forwarding heal request:', error);
    res.status(500).json({ error: 'Failed to process healing' });
  }
});

app.get('/enemies/active', async (req, res) => {
  console.log(`Bridge received request to get active enemies`);
 
  try {
    // Change this line:
    const response = await fetch(`${GAME_API_URL}/enemies/active`, {
      method: 'GET'
    });
    
    // Pass through the response
    const responseText = await response.text();
    console.log('Active enemies response:', responseText.substring(0, 100));
    
    try {
      // Try to parse as JSON
      const responseData = JSON.parse(responseText);
      res.status(response.status).json(responseData);
    } catch (e) {
      // If not valid JSON, send as is
      console.error('Failed to parse response as JSON:', e);
      res.status(response.status).send(responseText);
    }
  } catch (error) {
    console.error('Error getting active enemies:', error);
    res.status(500).json({ error: 'Failed to retrieve active enemies' });
  }
});

// Route for getting all characters (useful for debug)
app.get('/characters/:userId', async (req, res) => {
  console.log(`Bridge received request to get characters for user ${req.params.userId}`);
  
  try {
    const response = await fetch(`${GAME_API_URL}/characters/user/${req.params.userId}`);
    
    const responseText = await response.text();
    try {
      const responseData = JSON.parse(responseText);
      res.status(response.status).json(responseData);
    } catch (e) {
      res.status(response.status).send(responseText);
    }
  } catch (error) {
    console.error('Error getting characters:', error);
    res.status(500).json({ error: 'Failed to get characters' });
  }
});

// Starting the server
app.listen(PORT, () => {
  console.log(`Stream Deck Bridge server running on port ${PORT}`);
  console.log(`Forwarding requests to Game API at ${GAME_API_URL}`);
});