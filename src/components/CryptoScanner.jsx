import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

const fetchCryptoData = async () => {
  // This is a mock API call. In a real application, you'd fetch from an actual API
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  return [
    { symbol: 'BTC/USDT', price: 50000, longInterest: 60, shortInterest: 40 },
    { symbol: 'ETH/USDT', price: 3000, longInterest: 55, shortInterest: 45 },
    { symbol: 'SOL/USDT', price: 100, longInterest: 70, shortInterest: 30 },
    { symbol: 'ADA/USDT', price: 1.5, longInterest: 45, shortInterest: 55 },
    { symbol: 'DOT/USDT', price: 20, longInterest: 50, shortInterest: 50 },
    { symbol: 'XRP/USDT', price: 0.75, longInterest: 52, shortInterest: 48 },
    { symbol: 'DOGE/USDT', price: 0.1, longInterest: 65, shortInterest: 35 },
    { symbol: 'LINK/USDT', price: 15, longInterest: 58, shortInterest: 42 },
    { symbol: 'UNI/USDT', price: 5, longInterest: 53, shortInterest: 47 },
    { symbol: 'AVAX/USDT', price: 80, longInterest: 62, shortInterest: 38 },
    { symbol: 'MATIC/USDT', price: 1.2, longInterest: 57, shortInterest: 43 },
    { symbol: 'ATOM/USDT', price: 25, longInterest: 54, shortInterest: 46 },
    { symbol: 'LTC/USDT', price: 150, longInterest: 51, shortInterest: 49 },
    { symbol: 'FTM/USDT', price: 0.5, longInterest: 59, shortInterest: 41 },
    { symbol: 'ALGO/USDT', price: 0.3, longInterest: 56, shortInterest: 44 },
  ];
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
      <h2 className="text-2xl font-bold mb-4">Crypto Perpetual Futures Scanner</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Long Interest</TableHead>
              <TableHead>Short Interest</TableHead>
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