'use strict';

const fs = require('fs');
const path = require('path');
const { Sequelize } = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};

const sequelize = config.use_env_variable
  ? new Sequelize(process.env[config.use_env_variable], config)
  : new Sequelize(config.database, config.username, config.password, config);

// Setup relasi jika ada
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Cek koneksi DB
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
testConnection();

// Sync hanya jika flag MIGRATE_DB aktif dan bukan production
if (process.env.MIGRATE_DB === "TRUE" && env !== "production") {
  sequelize.sync({ alter: true }).then(() => {
    console.log("Successfully sync database");
  });
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
