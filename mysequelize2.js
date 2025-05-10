const { Sequelize } = require('sequelize');

// Replace with your own database connection details
const sequelize = new Sequelize('ss_enterprise', 'root', '', {
  host: 'localhost', // or your database server
  dialect: 'mysql', // change if using another database (e.g., 'postgres', 'sqlite', 'mssql')
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
