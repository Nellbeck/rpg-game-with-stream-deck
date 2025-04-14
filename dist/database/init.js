"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = initializeDatabase;
const database_1 = require("../config/database");
async function initializeDatabase() {
    try {
        const pool = await database_1.SqlConnection.getPool();
        // Check if Characters table exists, if not, create it
        await pool.request().query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Characters' and xtype='U')
      CREATE TABLE Characters (
        id INT PRIMARY KEY IDENTITY(1,1),
        userId NVARCHAR(100) NOT NULL,
        name NVARCHAR(100) NOT NULL,
        class NVARCHAR(50) NOT NULL,
        level INT DEFAULT 1,
        experience INT DEFAULT 0,
        strength INT NOT NULL,
        dexterity INT NOT NULL,
        intelligence INT NOT NULL,
        constitution INT NOT NULL,
        health INT NOT NULL,
        mana INT NOT NULL,
        gold INT DEFAULT 100,
        createdAt DATETIME DEFAULT GETDATE(),
        updatedAt DATETIME DEFAULT GETDATE()
      )
    `);
        console.log('Database initialized successfully');
    }
    catch (error) {
        console.error('Database initialization error:', error);
        throw error;
    }
}
