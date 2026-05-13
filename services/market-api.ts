// @/services/market-intelligence.ts
const BASE_URL = "https://commodities-api.com/api/latest";
const KEY = process.env.NEXT_PUBLIC_MARKET_API_KEY;

export const getLiveMarketData = async () => {
  // We fetch specific symbols: LCAT (Cattle), CORN, WHEAT
  const symbols = "LCAT,CORN,WHEAT,SOYBEAN";
  
  try {
    const response = await fetch(`${BASE_URL}?access_key=${KEY}&symbols=${symbols}`);
    const result = await response.json();

    if (result.success) {
      // Commodities-API returns rates relative to 1 USD
      return {
        cattle: (1 / result.data.rates.LCAT).toFixed(2),
        corn: (1 / result.data.rates.CORN).toFixed(2),
        wheat: (1 / result.data.rates.WHEAT).toFixed(2),
        timestamp: result.data.date
      };
    }
    throw new Error("API Limit reached or invalid key");
  } catch (err) {
    console.error("Market Data Error:", err);
    return null;
  }
};
// src/services/market-service.ts

export async function fetchKenyaMarketData() {
  try {
    // If you don't have a real API URL yet, return this mock data 
    // to stop the "Function not implemented" error.
    return {
      maize: 5200, // Ksh per 90kg bag
      cattle: 45000, // Average head price
      lastUpdated: new Date().toISOString()
    };
    
    /* Once you have an API key, use this:
    const res = await fetch('https://api.example.com/kenya-market');
    return res.json();
    */
  } catch (error) {
    console.error("Market fetch failed:", error);
    return null;
  }
}