import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

const fetchCryptoData = async () => {
  const response = await fetch('https://api.binance.com/api/v3/ticker/24hr');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const CryptoScanner = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['cryptoData'],
    queryFn: fetchCryptoData,
    refetchInterval: 60000, // Refetch every 60 seconds
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // Filter for USDT pairs and sort by volume
  const filteredData = data
    ?.filter(crypto => crypto.symbol.endsWith('USDT'))
    .sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume))
    .slice(0, 100); // Top 100 by volume

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Cryptocurrency Market Scanner</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Symbol</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>24h Change</TableHead>
              <TableHead>Volume</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData && filteredData.map((crypto) => (
              <TableRow key={crypto.symbol}>
                <TableCell>{crypto.symbol.replace('USDT', '')}</TableCell>
                <TableCell>${parseFloat(crypto.lastPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CryptoScanner;