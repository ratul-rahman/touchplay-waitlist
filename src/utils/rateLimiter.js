const rateLimitStore = new Map();

export const checkRateLimit = (identifier, maxRequests = 5, windowMs = 60000) => {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  if (!rateLimitStore.has(identifier)) {
    rateLimitStore.set(identifier, []);
  }
  
  const requests = rateLimitStore.get(identifier).filter(time => time > windowStart);
  
  if (requests.length >= maxRequests) {
    return false;
  }
  
  requests.push(now);
  rateLimitStore.set(identifier, requests);
  return true;
};