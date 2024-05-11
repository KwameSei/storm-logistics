import nodemailer from 'nodemailer';

// Function to send email notification to admin about new shipment
const notifyAdminAboutAgent = async (savedAgent) => {
  try {
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

    // Define email content
    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'New Agent Request',
      html: `<p>A new agent has been created:</p>
      <ul>
        <li>Agent ID: ${savedAgent._id}</li> 
        <li>Approve agent URL: ${process.env.BASE_URL}/api/agent/approve-agent/${savedAgent._id}</li>
        <li>Sender: ${savedAgent.username}</li>
        <li>Sender's phone: ${savedAgent.phone}</li>
        <li>Sender's email: ${savedAgent.email}</li>
      `
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

export default notifyAdminAboutAgent;