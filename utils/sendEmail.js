const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendReviewNotificationEmail(review, ownerEmail) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: ownerEmail,
      subject: 'New Review on Your Listing!',
      text: `You received a new review on your listing: \n\nRating: ${review.rating}\nComment: ${review.comment}`,
    });
    console.log('Review notification email sent successfully.');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

module.exports = sendReviewNotificationEmail;
