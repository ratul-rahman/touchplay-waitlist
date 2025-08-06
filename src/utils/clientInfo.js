export const getClientInfo = async () => {
  try {
    // Use a CORS-friendly service or skip geo for now
    // Alternative: Use ipify.org (CORS-friendly) for IP only
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    
    // For now, just get IP. Add geo later via server-side
    return { 
      ip: data.ip, 
      country: null, // Will add via server-side later
      city: null 
    };
  } catch (error) {
    console.error('Failed to get client info:', error);
    // Fallback: no geo data (still works fine)
    return { ip: null, country: null, city: null };
  }
};
