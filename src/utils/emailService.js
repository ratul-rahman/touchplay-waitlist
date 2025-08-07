// Get the correct API URL based on environment
const getApiUrl = () => {
  // If we're in development
  if (import.meta.env.DEV) {
    return 'http://localhost:3000';
  }
  
  // If we have a custom API URL set
  if (import.meta.env.BASE_URL) {
    return import.meta.env.BASE_URL;
  }
  
  // For production, use the same domain as the frontend
  return window.location.origin;
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

    console.log('📨 Response status:', response.status);
    console.log('📨 Response headers:', Object.fromEntries(response.headers.entries()));

    // Check if response has content
    const contentLength = response.headers.get('content-length');
    const contentType = response.headers.get('content-type');
    
    console.log('📊 Content-Length:', contentLength);
    console.log('📊 Content-Type:', contentType);

    // Get response text first to handle empty responses
    const responseText = await response.text();
    console.log('📝 Raw response text:', responseText);

    // Only try to parse as JSON if we have content
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