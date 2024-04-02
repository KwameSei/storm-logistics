import nodemailer from 'nodemailer';

// Function to send email with tracking number
const shipmentApprovalMail = async (shipment, senderMail) => {
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
      to: senderMail,
      subject: 'Your Shipment Approval',
      html: `
        <h1>Your Shipment Has Been Approved</h1>
        <p>Your shipment with tracking number ${shipment.trackingNumber} has been approved by the admin.</p>
        <p>Please proceed to make the payment to complete the shipment process.</p>
        <p>Payment link: <a href="http://yourdomain.com/payment">Make Payment</a></p>
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

export default shipmentApprovalMail;