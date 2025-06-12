'use strict';
const {Contact} = require('../models');

class ContactServices {
    
    static async createContact(name,message){
      return await Contact.create({name,message});
      }

}

module.exports = ContactServices;
