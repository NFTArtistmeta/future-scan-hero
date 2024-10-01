import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

const fetchCryptoData = async () => {
  // This is a mock API call. In a real application, you'd fetch from Binance API
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  
  // Generate a large list of Binance perpetual futures pairs
  const pairs = [
    'BTC', 'ETH', 'BNB', 'ADA', 'XRP', 'DOT', 'UNI', 'LTC', 'LINK', 'BCH', 'MATIC',
    'XLM', 'ETC', 'ALGO', 'ATOM', 'ICP', 'TRX', 'EOS', 'FIL', 'XMR', 'AAVE', 'LUNA',
    'CAKE', 'AVAX', 'FTT', 'DOGE', 'SOL', 'RUNE', 'SUSHI', 'CHZ', 'COMP', 'THETA',
    'VET', 'AXS', 'NEO', 'MKR', 'KSM', 'FTM', 'WAVES', 'ICX', 'DASH', 'ZEC', 'XTZ',
    'ENJ', 'EGLD', 'NEAR', 'BAT', 'HNT', 'ZIL', 'DGB', 'YFI', 'QTUM', 'ONT', 'ZRX',
    'IOTA', 'BTT', 'RVN', 'MANA', 'HBAR', 'HOT', 'NANO', 'OMG', 'CRV', 'SAND', 'ANKR'
  ];

  return pairs.map(symbol => {
    const price = +(Math.random() * 10000).toFixed(2);
    const takeProfitPercentage = +(Math.random() * 20 + 1).toFixed(2); // 1-21% range
    const stopLossPercentage = +(Math.random() * 10 + 1).toFixed(2); // 1-11% range
    
    return {
      symbol: `${symbol}/USDT`,
      price: price,
      longInterest: +(Math.random() * 100).toFixed(2),
      shortInterest: +(Math.random() * 100).toFixed(2),
      takeProfit: +(price * (1 + takeProfitPercentage / 100)).toFixed(2),
      stopLoss: +(price * (1 - stopLossPercentage / 100)).toFixed(2),
    };
  });
};

const CryptoScanner = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['cryptoData'],
    queryFn: fetchCryptoData,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Binance Perpetual Futures Scanner</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Long Interest</TableHead>
              <TableHead>Short Interest</TableHead>
              <TableHead>Take Profit</TableHead>
              <TableHead>Stop Loss</TableHead>
              <TableHead>Dominant Position</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((crypto) => (
              <TableRow key={crypto.symbol}>
                <TableCell>{crypto.symbol}</TableCell>
                <TableCell>${crypto.price.toLocaleString()}</TableCell>
                <TableCell>{crypto.longInterest}%</TableCell>
                <TableCell>{crypto.shortInterest}%</TableCell>
                <TableCell>${crypto.takeProfit.toLocaleString()}</TableCell>
                <TableCell>${crypto.stopLoss.toLocaleString()}</TableCell>
                <TableCell>
                  {crypto.longInterest > crypto.shortInterest ? (
                    <span className="text-green-500 flex items-center">
                      Long <ArrowUpIcon className="ml-1 h-4 w-4" />
                    </span>
                  ) : crypto.shortInterest > crypto.longInterest ? (
                    <span className="text-red-500 flex items-center">
                      Short <ArrowDownIcon className="ml-1 h-4 w-4" />
                    </span>
                  ) : (
                    <span className="text-yellow-500">Neutral</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CryptoScanner;