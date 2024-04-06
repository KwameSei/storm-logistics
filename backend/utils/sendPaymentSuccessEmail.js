import nodemailer from 'nodemailer';

// Function to send email on payment success
const sendPaymentSuccessEmail = async (savedPayment, response) => {
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
      to: response.customer.email,
      subject: 'Payment Successful',
      html: `
        <h1>Payment Successful</h1>
        <p>Your payment of GHS ${savedPayment.amount} for your shipment has been successful.</p>
        <p><br /> Thank you for using our service.</p>
      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
};

export default sendPaymentSuccessEmail;