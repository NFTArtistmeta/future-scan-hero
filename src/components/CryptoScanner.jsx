import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { fetchBinanceData, fetchBybitData } from '../utils/exchangeApis';

const calculatePositions = (price, volatility) => {
  const longEntry = price;
  const shortEntry = price;
  const takeProfitLong = price * (1 + volatility * 10);
  const stopLossLong = price * (1 - volatility * 5);
  const takeProfitShort = price * (1 - volatility * 10);
  const stopLossShort = price * (1 + volatility * 5);

  return {
    longEntry: longEntry.toFixed(4),
    shortEntry: shortEntry.toFixed(4),
    takeProfitLong: takeProfitLong.toFixed(4),
    stopLossLong: stopLossLong.toFixed(4),
    takeProfitShort: takeProfitShort.toFixed(4),
    stopLossShort: stopLossShort.toFixed(4),
  };
};

const fetchAllData = async () => {
  try {
    const [binanceData, bybitData] = await Promise.all([
      fetchBinanceData(),
      fetchBybitData()
    ]);
    return {
      binance: binanceData,
      bybit: bybitData
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return { binance: [], bybit: [] };
  }
};

const ExchangeTable = ({ data, exchangeName }) => {
  if (!data || data.length === 0) {
    return (
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">{exchangeName}</h3>
        <p>No data available for {exchangeName}. Please check the console for error messages.</p>
      </div>
    );
  }

  const sortedData = [...data].sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume));

  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-4">{exchangeName}</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Symbol</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>24h Change</TableHead>
            <TableHead>Volume</TableHead>
            <TableHead>Long Entry</TableHead>
            <TableHead>Short Entry</TableHead>
            <TableHead>TP Long</TableHead>
            <TableHead>SL Long</TableHead>
            <TableHead>TP Short</TableHead>
            <TableHead>SL Short</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((crypto) => {
            const price = parseFloat(crypto.lastPrice);
            const volatility = Math.abs(parseFloat(crypto.priceChangePercent) / 100);
            const positions = calculatePositions(price, volatility);

            return (
              <TableRow key={crypto.symbol}>
                <TableCell>{crypto.symbol}</TableCell>
                <TableCell>${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</TableCell>
                <TableCell>
                  <span className={parseFloat(crypto.priceChangePercent) > 0 ? "text-green-500" : "text-red-500"}>
                    {parseFloat(crypto.priceChangePercent) > 0 ? (
                      <ArrowUpIcon className="inline mr-1 h-4 w-4" />
                    ) : (
                      <ArrowDownIcon className="inline mr-1 h-4 w-4" />
                    )}
                    {parseFloat(crypto.priceChangePercent).toFixed(2)}%
                  </span>
                </TableCell>
                <TableCell>${parseFloat(crypto.volume).toLocaleString(undefined, { maximumFractionDigits: 0 })}</TableCell>
                <TableCell className="text-green-500">${positions.longEntry}</TableCell>
                <TableCell className="text-red-500">${positions.shortEntry}</TableCell>
                <TableCell>${positions.takeProfitLong}</TableCell>
                <TableCell>${positions.stopLossLong}</TableCell>
                <TableCell>${positions.takeProfitShort}</TableCell>
                <TableCell>${positions.stopLossShort}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

const CryptoScanner = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['cryptoData'],
    queryFn: fetchAllData,
    refetchInterval: 30000,
  });

  if (isLoading) return <div className="text-center py-10">Loading cryptocurrency data...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Cryptocurrency Futures Scanner</h2>
      <ExchangeTable data={data?.binance} exchangeName="Binance" />
      <ExchangeTable data={data?.bybit} exchangeName="Bybit" />
    </div>
  );
};

export default CryptoScanner;