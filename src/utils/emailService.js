export const sendWelcomeEmail = async (email, verificationToken) => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, verificationToken })
    });

    const result = await response.json();
    
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
