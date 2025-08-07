export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, verificationToken } = req.body;
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const BASE_URL = process.env.BASE_URL; // Set this in your deployment environment

    if (!RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY not found in environment variables');
      return res.status(500).json({ error: 'Email service not configured' });
    }

    if (!email || !verificationToken) {
      return res.status(400).json({ error: 'Email and verification token are required' });
    }

    // Prefer BASE_URL, fallback to req.headers.origin, never default to localhost in production
    let origin = BASE_URL || req.headers.origin;
    if (!origin) {
      return res.status(500).json({ error: 'Unable to determine application URL' });
    }
    // Remove trailing slash if present
    origin = origin.replace(/\/$/, '');

    const verificationUrl = `${origin}/verify?token=${verificationToken}`;

    const emailContent = {
      from: 'TouchPlay <noreply@updates.ratul-rahman.com>',
      to: email,
      subject: '🎮 Welcome to TouchPlay - The Future of Playable Ads!',
      html: `...` // (keep your HTML as is)
    };

    // (rest of your code unchanged)
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailContent)
    });

    const responseText = await response.text();
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      return res.status(500).json({ 
        error: 'Invalid response from email service',
        details: responseText 
      });
    }
    
    if (response.ok) {
      return res.status(200).json({ success: true, id: result.id });
    } else {
      return res.status(400).json({ error: result });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
