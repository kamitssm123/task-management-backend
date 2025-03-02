import express from 'express';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js'
import { sequelize } from './models/User.js';

import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
  

async function checkConnection() {
    try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
}

async function createTable() {
    try {
        const [result, metadata] = await sequelize.query(`
            CREATE TABLE if not exists users (
                "id" SERIAL PRIMARY KEY,
                "username" VARCHAR(255) NOT NULL,
                "email" VARCHAR(255) NOT NULL UNIQUE,
                "password" VARCHAR(255) NOT NULL,
                "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );

            `);
        console.log(result);
    }
    catch(err){
        console.log(err);
    }
};
async function blackListTokenTable() {
    try {
        const [result, metadata] = await sequelize.query(`
            CREATE TABLE if not exists blacklisted_tokens (
                id SERIAL PRIMARY KEY,
                token TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            `);
        console.log(result);
    }
    catch(err){
        console.log(err);
    }
};


  
checkConnection();
createTable();
blackListTokenTable();
app.use(cors());
app.use(express.json());

app.use('/', authRoutes);

app.listen(PORT, () => {
    console.log(`User Service listening on port ${PORT}`);
});
