// emailServices.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false, // or 'STARTTLS'
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS // replace with your actual password
  }
});

// generateWelcomeEmail.js
const generateWelcomeEmail = (username) => {
  return `
    <h1>Welcome to our Assignment project, ${username}!</h1>
    <p>We're excited to have you on board.</p>
    <p>Best regards,</p>
    <p>Assignment project team</p>
  `;
}



// Send welcome email
const sendWelcomeEmail = async (username,email) => {
console.log(username,email)
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    console.error('Invalid email address:', email);
    return false;
  }

  try {
    console.log(email, username);

    // Send email
    await transporter.sendMail({
      from:process.env.EMAIL_FROM_ADDRESS,
      to:email,
      subject: "Welcome to our Assignment project",
       html:generateWelcomeEmail(username)
    });
    console.log(`Welcome email sent to: ${email}`);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
}

module.exports = sendWelcomeEmail;