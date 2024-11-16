const twilio = require('twilio');

// Load credentials from the .env file
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhoneNumber = process.env.TWILIO_PHONE_NUMBER;  // Your Twilio phone number

// Create Twilio client
const client = new twilio(accountSid, authToken);

const sendReviewNotificationSms = async (review, ownerPhone) => {
    try {
        await client.messages.create({
            body: `New review on your listing: ${review.comment} - Rating: ${review.rating}`,
            from: fromPhoneNumber,  // Your Twilio phone number
            to: ownerPhone,         // The owner's phone number
        });
    } catch (error) {
        console.error('Error sending SMS:', error);
        throw new Error('Failed to send SMS');
    }
};

module.exports = sendReviewNotificationSms;
