"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const database_1 = require("./config/database");
const character_routes_1 = __importDefault(require("./routes/character.routes"));
const inventory_routes_1 = __importDefault(require("./routes/inventory.routes"));
const enemy_routes_1 = __importDefault(require("./routes/enemy.routes"));
const combat_routes_1 = __importDefault(require("./routes/combat.routes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/characters', character_routes_1.default);
app.use('/api/inventory', inventory_routes_1.default);
app.use('/api/enemies', enemy_routes_1.default);
app.use('/api/combat', combat_routes_1.default);
// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});
// Start the server
const startServer = async () => {
    try {
        await (0, database_1.connectDatabase)();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
