'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Contact extends Model {}
  Contact.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Name cannot be empty',
          },
        },
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Message cannot be empty',
          },
          len: {
            args: [10, 1000], // Minimum 10, maximum 1000 characters
            msg: 'Message should be at least 10 characters and less than 1000 characters',
          },
        },
      },
    },
    {
      sequelize,
      modelName: 'Contact',
      tableName: 'Contact_messages',
      timestamps: true,
    }
  );
  return Contact;
};