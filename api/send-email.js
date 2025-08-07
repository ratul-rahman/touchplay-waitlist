module.exports = async function handler(req, res) {
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
      html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to TouchPlay</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; margin-top: 40px; margin-bottom: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">
          
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
            <div style="background: white; width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
              <div style="font-size: 24px;">🎮</div>
            </div>
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Welcome to TouchPlay!</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0; font-size: 16px;">The AI-native platform for high-ROI playable ads</p>
          </div>
          
          <div style="padding: 40px;">
            <h2 style="color: #1a1a1a; font-size: 20px; margin: 0 0 16px;">You're in! 🚀</h2>
            <p style="color: #666; line-height: 1.6; margin: 0 0 24px;">Thank you for joining our waitlist! You're now part of an exclusive group of forward-thinking mobile game marketers who will shape the future of playable advertising.</p>
            
            <div style="background: #f8fafc; border-radius: 12px; padding: 24px; margin: 24px 0;">
              <h3 style="color: #1a1a1a; font-size: 16px; margin: 0 0 12px; display: flex; align-items: center;">
                <span style="margin-right: 8px;">✨</span> What's Next?
              </h3>
              <ul style="color: #666; line-height: 1.6; margin: 0; padding-left: 0; list-style: none;">
                <li style="margin-bottom: 8px;">🎯 <strong>Early Beta Access</strong> - Be first to try TouchPlay</li>
                <li style="margin-bottom: 8px;">📊 <strong>Exclusive Updates</strong> - Behind-the-scenes development insights</li>
                <li style="margin-bottom: 8px;">💳 <strong>Free Credits</strong> - Start creating when we launch</li>
                <li>🎮 <strong>Guided Demo</strong> - Personal walkthrough of the platform</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 32px 0;">
              <a href="${verificationUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; display: inline-block; box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);">
                Verify Email & Secure Your Spot
              </a>
            </div>
            
            <div style="border-top: 1px solid #e5e7eb; padding-top: 24px; margin-top: 24px;">
              <p style="color: #9ca3af; font-size: 14px; margin: 0; text-align: center;">
                Made with ❤️ by the TouchPlay team<br>
                <em>"Prompt. Attach. Generate. Ship."</em>
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>` // (keep your HTML as is)
    };

    // (rest of your code unchanged)
    const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
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
