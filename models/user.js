'use strict';
const { Model, DataTypes, sequelize } = require('sequelize');
// const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  // Define the User class that extends the Sequelize Model class
  class User extends Model {
    // Before creating a user, hash the password using bcrypt
    // static async beforeCreate(user, options) {
    //   if (user.password && typeof user.password === 'string') {
    //     user.password = await bcrypt.hash(user.password, 12);
    //   } else {
    //     throw new Error('Password must be a non-empty string.');
    //   }
    // }
  }

  // Initialize the User model with specified attributes and validations
  User.init(
    {
      // Define the 'name' attribute with string data type, length constraints, and validation rules
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          len: {
            args: [3, 50],
            msg: 'Name must be between 3 and 50 characters long.',
          },
          is: {
            args: /^[a-zA-Z ]+$/,
            msg: 'Name can only contain letters and spaces.',
          },
        },
      },
      // Define the 'email' attribute with string data type, constraints, and validation rules
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: {
          msg: 'This email is already in use.',
        },
        validate: {
          isEmail: {
            msg: 'Invalid email address.',
          },
          max: {
            args: 255,
            msg: 'Email cannot exceed 255 characters.',
          },
        },
      },
      // // Define the 'googleId' attribute for Google OAuth users
      // googleId: {
      //   type: DataTypes.STRING,
      //   allowNull: true,
      //   unique: true,
      // },
      // Define the 'password' attribute with string data type, constraints, and validation rules
      password: {
        type: DataTypes.STRING,
        allowNull: true, // Now nullable for Google users
        validate: {
          len: {
            args: [8, 255],
            msg: 'Password must be between 8 and 255 characters long.',
          },
        },
      },
      // Add the 'image' attribute for storing user image filename or path
      // image: {
      //   type: DataTypes.STRING(2000),
      //   allowNull: true,
      //   validate: {
      //     max: {
      //       args: 2000,
      //       msg: 'Image filename cannot exceed 2000 characters.',
      //     },
      //   },
      // },
    },
    {
      sequelize, // Pass the Sequelize instance to bind the model to the database connection
      modelName: 'User', // Specify the model name
      tableName: 'Users', // Specify the table name in the database
      timestamps: true, // Enable timestamps (createdAt and updatedAt fields)
      paranoid: false, // Disable soft deletion (paranoid mode)
      // hooks: {
      //   beforeCreate: User.beforeCreate, // Assign the beforeCreate hook to hash the password before creating a user
      // },
    }
  );

  return User;
};