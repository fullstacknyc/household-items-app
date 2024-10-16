const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();
const db = admin.firestore();

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password',
  },
});

// Function to send email notifications for Low or Depleted items
exports.sendLowStockEmail = functions.pubsub.schedule('every sunday 09:00').onRun(async (context) => {
  const itemsRef = db.collection('items');
  const lowItems = await itemsRef.where('status', 'in', ['Low', 'Depleted']).get();

  if (lowItems.empty) {
    console.log('No low or depleted items');
    return null;
  }

  let itemList = '';
  lowItems.forEach(doc => {
    const item = doc.data();
    itemList += `${item.name} - ${item.status}\n`;
  });

  // Email content
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: 'recipient-email@gmail.com',
    subject: 'Low or Depleted Household Items',
    text: `The following items are either low or depleted:\n\n${itemList}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }

  return null;
});
