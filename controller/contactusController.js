const { Error } = require("sequelize");
const {Contact} = require("../models");
const ContactServices = require("../services/contactServices");
const contactValidationSchema = require("../validator/contactValidator")
const ContactUs = async(req,res)=>{
    try {
      const { error } = await contactValidationSchema.validateAsync(req.body, { abortEarly: false });


      if (error) {
        console.log('Raw Joi errors:', error.details); // Debug raw errors
        const errors = {};
        error.details.forEach(detail => {
          const field = detail.path[0];
          // Use the last error for each field to avoid duplicates
          errors[field] = detail.message;
        });
        return res.status(400).json({
          message: 'Validation failed',
          errors,
        });
      }

      const { name, message } = req.body;

      const contact_creation =  ContactServices.createContact(name,message);
  if(!contact_creation){
    throw new Error('Error in Sending the Contact details')
  } 
  return res.status(200).json({
    message:"Contact details send successfully",
    success:true
  })
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
          return res.status(400).json({
            message: error.errors.map(e => e.message).join(', ')
          });
        }
        return res.status(500).json({
          message: 'Something went wrong. Please try again later.',
          error: error.message
        });
      }
}


module.exports = ContactUs;

