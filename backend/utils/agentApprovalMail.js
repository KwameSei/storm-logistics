import nodemailer from 'nodemailer';

// Function to send email with tracking number
const agentApprovalMail = async (agent, email) => {
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
      to: email,
      subject: 'You Have Been Approved',
      html: `
        <h1>Your agent account for Storm Logistics has been approved</h1>
        <p>
          Dear ${agent.username}, your agent account has been approved by the admin.
          Thank you for choosing to work with us. We look forward to a successful partnership.
        </p>
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

export default agentApprovalMail;