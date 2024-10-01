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

export const fetchMEXCData = async () => {
  try {
    const response = await axios.get('https://contract.mexc.com/api/v1/contract/ticker');
    console.log('MEXC raw data:', response.data); // Add this line for debugging
    if (response.data && response.data.data) {
      return response.data.data.map(item => ({
        symbol: item.symbol,
        lastPrice: item.last,
        priceChangePercent: item.percentage,
        volume: item.volume,
        exchange: 'MEXC'
      }));
    } else {
      console.error('Unexpected MEXC data structure:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching MEXC data:', error);
    return [];
  }
};