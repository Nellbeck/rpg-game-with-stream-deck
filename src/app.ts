import express from 'express';
import cors from 'cors';
import { connectDatabase } from './config/database';
import characterRoutes from './routes/character.routes';
import inventoryRoutes from './routes/inventory.routes';
import enemyRoutes from "./routes/enemy.routes";
import combatRoutes from "./routes/combat.routes";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/characters', characterRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/enemies', enemyRoutes);
app.use('/api/combat', combatRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start the server
const startServer = async () => {
  try { 
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();