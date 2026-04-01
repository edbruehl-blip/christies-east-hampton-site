import { describe, it, expect } from 'vitest';

describe('Twilio credentials validation', () => {
  it('should have all four Twilio env vars set', () => {
    expect(process.env.TWILIO_ACCOUNT_SID).toBeTruthy();
    expect(process.env.TWILIO_AUTH_TOKEN).toBeTruthy();
    expect(process.env.TWILIO_WHATSAPP_FROM).toBeTruthy();
    expect(process.env.WILLIAM_WHATSAPP_TO).toBeTruthy();
  });

  it('TWILIO_ACCOUNT_SID should start with AC', () => {
    expect(process.env.TWILIO_ACCOUNT_SID?.startsWith('AC')).toBe(true);
  });

  it('TWILIO_WHATSAPP_FROM should be in whatsapp: format', () => {
    expect(process.env.TWILIO_WHATSAPP_FROM?.startsWith('whatsapp:')).toBe(true);
  });

  it('WILLIAM_WHATSAPP_TO should be in whatsapp: format', () => {
    expect(process.env.WILLIAM_WHATSAPP_TO?.startsWith('whatsapp:')).toBe(true);
  });

  it('should validate Twilio credentials against API', async () => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID!;
    const authToken = process.env.TWILIO_AUTH_TOKEN!;

    const credentials = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}.json`,
      {
        headers: {
          Authorization: `Basic ${credentials}`,
        },
      }
    );

    // 200 = valid credentials, 401 = invalid
    expect(response.status).toBe(200);
    const data = await response.json() as { sid: string; status: string };
    expect(data.sid).toBe(accountSid);
    expect(data.status).toBe('active');
  }, 15000);
});
