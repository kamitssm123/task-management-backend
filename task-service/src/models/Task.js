import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv'

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false
});

// const sequelize = new Sequelize('postgres://user:password@db:5432/db');
const Task = sequelize.define('tasks', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  priority: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending'
  },
  start_time: {
    type: DataTypes.DATE,
    allowNull: true
  },
  end_time: {
    type: DataTypes.DATE,
    allowNull: true
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  }
}, {
  timestamps: false, 
  tableName: 'tasks' 
});

export { Task, sequelize };
