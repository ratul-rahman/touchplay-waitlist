// Always use a relative API path in production for Vercel compatibility

const getApiUrl = () => {
  // Use localhost only in development
  if (import.meta.env.DEV) {
    return 'http://localhost:3000';
  }
  // In production, use a relative path (no domain)
  return '';
};

export const sendWelcomeEmail = async (email, verificationToken) => {
  try {
    console.log('📧 Sending email to:', email);

    const apiUrl = getApiUrl();
    const endpoint = `${apiUrl}/api/send-email`;

    console.log('🌐 Using API endpoint:', endpoint);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, verificationToken })
    });

    // Get response text first to handle empty responses
    const responseText = await response.text();
    let result;
    if (responseText.trim()) {
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ JSON Parse Error:', parseError);
        console.error('Raw response that failed to parse:', responseText);
        return false;
      }
    } else {
      console.error('❌ Empty response from server');
      return false;
    }

    if (response.ok) {
      console.log('✅ Email sent successfully!', result);
      return true;
    } else {
      console.error('❌ Email API Error:', result);
      return false;
    }
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return false;
  }
};