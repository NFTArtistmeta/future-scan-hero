import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

const fetchCryptoData = async () => {
  const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false');
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
              <TableHead>Market Cap</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data && data.map((crypto) => (
              <TableRow key={crypto.id}>
                <TableCell>{crypto.symbol.toUpperCase()}</TableCell>
                <TableCell>${crypto.current_price?.toLocaleString() ?? 'N/A'}</TableCell>
                <TableCell>
                  {crypto.price_change_percentage_24h ? (
                    <span className={crypto.price_change_percentage_24h > 0 ? "text-green-500" : "text-red-500"}>
                      {crypto.price_change_percentage_24h > 0 ? (
                        <ArrowUpIcon className="inline mr-1 h-4 w-4" />
                      ) : (
                        <ArrowDownIcon className="inline mr-1 h-4 w-4" />
                      )}
                      {crypto.price_change_percentage_24h.toFixed(2)}%
                    </span>
                  ) : 'N/A'}
                </TableCell>
                <TableCell>${crypto.market_cap?.toLocaleString() ?? 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CryptoScanner;