/**
 * utils/sms.js
 *
 * Sends SMS via smsmode REST API.
 * Falls back to simulation logging in development if key is missing.
 */

const smsmodeApiKey = process.env.SMSMODE_API_KEY;

/**
 * Sends an SMS via smsmode API.
 * @param {string} to - Destination phone number (e.g. +917042294029)
 * @param {string} body - SMS message content
 */
export const sendSMS = async (to, body) => {
  if (!to || !body) return null;

  // Format destination number: strip "+" and ensure international prefix (e.g. 91 for India)
  let normalizedTo = to.trim().replace('+', '').replace(/\s+/g, '');
  if (normalizedTo.length === 10) {
    normalizedTo = '91' + normalizedTo;
  }

  if (smsmodeApiKey) {
    try {
      const response = await fetch('https://rest.smsmode.com/sms/v1/messages', {
        method: 'POST',
        headers: {
          'X-Api-Key': smsmodeApiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          recipient: {
            to: normalizedTo
          },
          body: {
            text: body
          }
        })
      });

      const data = await response.json();
      if (!response.ok) {
        console.error(`smsmode API error (status ${response.status}):`, data);
        return null;
      }

      console.log(`SMS successfully dispatched via smsmode to ${normalizedTo}. Response:`, data);
      return data;
    } catch (err) {
      console.error(`smsmode SMS dispatch failed to ${normalizedTo}:`, err.message);
      return null;
    }
  } else {
    console.log(`[smsmode SMS Simulation] To: ${normalizedTo} | Body: ${body}`);
    return { id: 'mock_smsmode_sid_' + Date.now(), simulated: true };
  }
};

/**
 * Sends a WhatsApp notification via Twilio (expects WhatsApp sandbox/enabled numbers).
 * Kept as placeholder/simulation since smsmode is used for SMS.
 */
export const sendWhatsApp = async (to, body) => {
  const formattedTo = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
  console.log(`[WhatsApp Simulation] To: ${formattedTo} | Body: ${body}`);
  return { sid: 'mock_wa_sid_' + Date.now(), simulated: true };
};
