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
    const response = await axios.get('https://api.bybit.com/v2/public/tickers');
    return response.data.result.map(item => ({ 
      symbol: item.symbol,
      lastPrice: item.last_price,
      priceChangePercent: item.price_24h_pcnt,
      volume: item.volume_24h,
      exchange: 'Bybit'
    }));
  } catch (error) {
    console.error('Error fetching Bybit data:', error);
    return [];
  }
};

export const fetchMEXCData = async () => {
  try {
    const response = await axios.get('https://contract.mexc.com/api/v1/contract/ticker');
    return response.data.data.map(item => ({
      symbol: item.symbol,
      lastPrice: item.last,
      priceChangePercent: item.percentage,
      volume: item.volume,
      exchange: 'MEXC'
    }));
  } catch (error) {
    console.error('Error fetching MEXC data:', error);
    return [];
  }
};