const { Sequelize } = require('sequelize');
const dotenv = require("dotenv").config();

// Replace with your own database connection details
const sequelize = new Sequelize( process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,// or your database server
    dialect: process.env.DB_DIALECT, // change if using another database (e.g., 'postgres', 'sqlite', 'mssql')
});

async function authenticate() {
  try {
    await sequelize.authenticate();
    console.log('Database Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

authenticate();

module.exports = sequelize;
