import express from 'express';
import { Sequelize } from 'sequelize';
import taskRoutes from './routes/taskRoutes.js';
import dotenv from 'dotenv';
import cors from 'cors'
import { sequelize } from './models/Task.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;
  

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
            CREATE TABLE IF NOT EXISTS tasks (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                priority INTEGER,
                user_id INTEGER REFERENCES users(id),
                status VARCHAR(50) NOT NULL,
                start_time TIMESTAMP,
                end_time TIMESTAMP,
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
app.use(cors());
app.use(express.json());

app.use('/', taskRoutes);

app.listen(PORT, () => {
    console.log(`Task Service listening on port ${PORT}`);
});
