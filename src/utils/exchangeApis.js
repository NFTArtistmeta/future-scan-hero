import axios from 'axios';

export const fetchBinanceData = async () => {
  try {
    const response = await axios.get('https://fapi.binance.com/fapi/v1/ticker/24hr');
    return response.data.map(item => ({ ...item, exchange: 'Binance' }));
  } catch (error) {
    console.error('Error fetching Binance data:', error);
    return [];
  }
};

export const fetchBybitData = async () => {
  try {
    const response = await axios.get('https://api.bybit.com/v5/market/tickers?category=linear');
    console.log('Bybit raw data:', response.data); // Add this line for debugging
    if (response.data && response.data.result && response.data.result.list) {
      return response.data.result.list.map(item => ({ 
        symbol: item.symbol,
        lastPrice: item.lastPrice,
        priceChangePercent: item.price24hPcnt,
        volume: item.volume24h,
        exchange: 'Bybit'
      }));
    } else {
      console.error('Unexpected Bybit data structure:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching Bybit data:', error);
    return [];
  }
};

export const fetchBitcoinHistoricalData = async () => {
  try {
    const response = await axios.get('https://api.binance.com/api/v3/klines', {
      params: {
        symbol: 'BTCUSDT',
        interval: '1h',
        limit: 168 // Last 7 days (24 * 7)
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Bitcoin historical data:', error);
    throw error;
  }
};
