export const calculateAnalytics = (data) => {
  const total = data.length;
  const verified = data.filter(item => item.verified).length;
  const verificationRate = total > 0 ? (verified / total * 100).toFixed(1) : 0;
  
  const countries = data.reduce((acc, item) => {
    const country = item.country || 'Unknown';
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {});
  
  const utmSources = data.reduce((acc, item) => {
    const source = item.utm_source || 'Direct';
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {});
  
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();
  
  const dailySignups = last7Days.map(date => {
    const count = data.filter(item => 
      new Date(item.created_at).toISOString().split('T')[0] === date
    ).length;
    return { date, count };
  });
  
  return {
    total,
    verified,
    verificationRate,
    countries: Object.entries(countries).map(([name, value]) => ({ name, value })),
    utmSources: Object.entries(utmSources).map(([name, value]) => ({ name, value })),
    dailySignups
  };
};