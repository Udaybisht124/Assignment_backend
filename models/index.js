'use strict';

const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.js')[env];

const db = {};

let sequelize;
try {
  if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], {
      ...config,
      dialect: 'postgres',
    });
  } else {
    sequelize = new Sequelize(config.database, config.username, config.password, {
      ...config,
      dialect: 'postgres',
    });
  }

  sequelize.authenticate()
    .then(() => console.log('Database connected successfully.'))
    .catch(err => console.error('Database connection error:', err));
} catch (error) {
  console.error('Sequelize initialization error:', error);
  throw error;
}

fs
  .readdirSync(__dirname)
  .filter(file =>
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file.slice(-3) === '.js'
  )
  .forEach(file => {
    try {
      const model = require(path.join(__dirname, file))(sequelize, DataTypes);
      if (!model || !model.name) {
        console.error(`Model in ${file} is invalid or missing name.`);
        return;
      }
      db[model.name] = model;
    } catch (error) {
      console.error(`Error loading model ${file}:`, error);
    }
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    try {
      db[modelName].associate(db);
    } catch (error) {
      console.error(`Error in associate for ${modelName}:`, error);
    }
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;