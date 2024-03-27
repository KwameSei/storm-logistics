import nodemailer from 'nodemailer';

// Function to send email with tracking number
const trackingMail = async (trackingNumber, userEmail) => {
  try {
    // Create a nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: false // for localhost
      }
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Your Shipment Tracking Number',
      text: `Your tracking number is: ${trackingNumber}. Please use this number to track your shipment.`
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
  } catch (error) {
    throw new Error('Failed to send tracking email');
  }
};

export default trackingMail;