/**
 * SMS Service for Authentication & OTPs
 * Supports Fast2SMS (India), 2Factor.in, Twilio, and dev console fallback using native Fetch.
 */

export const sendOtpSms = async ({ phone, otp }) => {
  const normalizedPhone = phone.replace(/\D/g, '').slice(-10);

  console.log('========================================================');
  console.log(`[AUTH OTP SERVICE] 📱 Phone Number: +91 ${normalizedPhone}`);
  console.log(`[AUTH OTP SERVICE] 🔑 Generated OTP Code: ${otp}`);
  console.log('========================================================');

  // 1. Fast2SMS Integration (India)
  // Get free API key from https://www.fast2sms.com
  const fast2smsApiKey = process.env.FAST2SMS_API_KEY;
  if (fast2smsApiKey) {
    try {
      const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          authorization: fast2smsApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          variables_values: otp,
          route: 'otp',
          numbers: normalizedPhone,
        }),
      });

      const data = await response.json();
      console.log('[Fast2SMS Status]:', data);
      if (data && (data.return === true || data.status_code === 200)) {
        return {
          success: true,
          provider: 'fast2sms',
          message: `OTP sent successfully to your mobile +91 ${normalizedPhone}`,
          phone: normalizedPhone,
          devOtp: otp,
        };
      }
    } catch (apiErr) {
      console.warn('[Fast2SMS] Error:', apiErr.message);
    }
  }

  // 2. 2Factor.in Integration (India)
  // Get API key from https://2factor.in
  const twoFactorApiKey = process.env.TWOFACTOR_API_KEY;
  if (twoFactorApiKey) {
    try {
      const url = `https://2factor.in/API/V1/${twoFactorApiKey}/SMS/+91${normalizedPhone}/${otp}/OTP1`;
      const response = await fetch(url);
      const data = await response.json();
      console.log('[2Factor Status]:', data);
      if (data && data.Status === 'Success') {
        return {
          success: true,
          provider: '2factor',
          message: `OTP sent successfully to +91 ${normalizedPhone}`,
          phone: normalizedPhone,
          devOtp: otp,
        };
      }
    } catch (apiErr) {
      console.warn('[2Factor] Error:', apiErr.message);
    }
  }

  // 3. Twilio Integration (Global)
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
  if (twilioSid && twilioAuthToken && twilioPhone) {
    try {
      const authHeader = 'Basic ' + Buffer.from(`${twilioSid}:${twilioAuthToken}`).toString('base64');
      const body = new URLSearchParams({
        To: `+91${normalizedPhone}`,
        From: twilioPhone,
        Body: `Your RU BIKER WORLD verification code is: ${otp}. Valid for 5 minutes.`,
      });

      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
        {
          method: 'POST',
          headers: {
            Authorization: authHeader,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: body.toString(),
        }
      );
      const data = await response.json();
      console.log('[Twilio Status]:', data?.status || data);
      return {
        success: true,
        provider: 'twilio',
        message: `OTP sent to +91 ${normalizedPhone}`,
        phone: normalizedPhone,
        devOtp: otp,
      };
    } catch (apiErr) {
      console.warn('[Twilio] Error:', apiErr.message);
    }
  }

  // 4. Default Local / Development OTP fallback
  console.log('[AUTH OTP] ℹ️ Note: No SMS Gateway API key detected in .env (e.g. FAST2SMS_API_KEY).');
  console.log(`[AUTH OTP] 👉 Use OTP code: ${otp} to log in directly!`);

  return {
    success: true,
    provider: 'local',
    message: `OTP generated for +91 ${normalizedPhone}`,
    phone: normalizedPhone,
    devOtp: otp,
  };
};

export default {
  sendOtpSms,
};
