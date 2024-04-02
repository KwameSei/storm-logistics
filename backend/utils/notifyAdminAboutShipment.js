import nodemailer from 'nodemailer';

// Function to send email notification to admin about new shipment
const notifyAdminAboutShipment = async (shipment) => {
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
      subject: 'New Shipment Request',
      html: `<p>A new shipment has been created:</p>
      <ul>
        <li>Shipment ID: ${shipment._id}</li> 
        <li>Shipment URL: ${process.env.BASE_URL}/api/shipment/approve-shipment/${shipment._id}</li>
        <li>Sender: ${shipment.senderName}</li>
        <li>Sender's phone: ${shipment.senderPhone}</li>
        <li>Sender's email: ${shipment.senderEmail}</li>
        <li>Recipient: ${shipment.recipientName}</li>
        <li>Recipient Phone: ${shipment.recipientPhone}</li>
      `
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

export default notifyAdminAboutShipment;