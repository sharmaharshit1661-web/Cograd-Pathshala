import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken  = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER || '+1234567890';

let client = null;
if (accountSid && authToken) {
  try {
    client = twilio(accountSid, authToken);
    console.log('Twilio client initialized successfully for production.');
  } catch (err) {
    console.error('Failed to initialize Twilio client:', err.message);
  }
}

/**
 * Sends a production SMS via Twilio, falls back to logging in development/testing.
 * @param {string} to - Destination phone number
 * @param {string} body - SMS message content
 */
export const sendSMS = async (to, body) => {
  if (client) {
    try {
      const message = await client.messages.create({
        body,
        to,
        from: twilioNumber,
      });
      console.log(`SMS successfully dispatched via Twilio to ${to}. Message SID: ${message.sid}`);
      return message;
    } catch (err) {
      console.error(`Twilio SMS dispatch failed to ${to}:`, err.message);
      return null;
    }
  } else {
    console.log(`[Twilio SMS Simulation] To: ${to} | Body: ${body}`);
    return { sid: 'mock_sms_sid_' + Date.now(), simulated: true };
  }
};

/**
 * Sends a WhatsApp notification via Twilio (expects WhatsApp sandbox/enabled numbers).
 * @param {string} to - Destination WhatsApp number (e.g. 'whatsapp:+919876543210')
 * @param {string} body - Message body
 */
export const sendWhatsApp = async (to, body) => {
  const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
  const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM || `whatsapp:${twilioNumber}`;

  if (client) {
    try {
      const message = await client.messages.create({
        body,
        to: formattedTo,
        from: whatsappFrom,
      });
      console.log(`WhatsApp message dispatched via Twilio to ${formattedTo}. SID: ${message.sid}`);
      return message;
    } catch (err) {
      console.error(`Twilio WhatsApp dispatch failed to ${formattedTo}:`, err.message);
      return null;
    }
  } else {
    console.log(`[Twilio WhatsApp Simulation] To: ${formattedTo} | Body: ${body}`);
    return { sid: 'mock_wa_sid_' + Date.now(), simulated: true };
  }
};
