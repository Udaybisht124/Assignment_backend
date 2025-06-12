'use strict';
const {User} = require("../models");
const bcrypt = require("bcryptjs");
const Sequelize = require("sequelize");
const jwt = require("jsonwebtoken");
class UserService{
    static async findUserByEmail(email){
        if(!User){
            throw new Error('user model is not defined')
        }
        const existingUser = await User.findOne({
            where: { email: { [Sequelize.Op.iLike]: email } },
          });
          return existingUser;
    }

    static async createUser(name,email,password){
        const hashedPassword = await bcrypt.hash(password,10);
        return User.create({name,email,password:hashedPassword});    }

 static  async validateUserPassword(user,password){
    if(!user){
        throw new Error('User model is not find')
    }
    const validatePassword = await bcrypt.compare(password,user.password);
     if(!validatePassword){
      return res.status(400).json({
        error_mesage:'Incorrect Password'
      })
     }
     return true;
 }

static async generateToken(user){
    if(!process.env.JWT_SECRET){
        throw new Error('JWT_SECRET is not defined')
    }
    return jwt.sign({id:user.id},process.env.JWT_SECRET,{expiresIn:'2h'})
}


}


module.exports = UserService;
