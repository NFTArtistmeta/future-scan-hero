import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis, ZAxis, Tooltip } from 'recharts';
import { fetchBitcoinHistoricalData } from '../utils/exchangeApis';

const BitcoinHeatmap = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['bitcoinHistorical'],
    queryFn: fetchBitcoinHistoricalData,
    refetchInterval: 60000, // Refetch every minute
  });

  if (isLoading) return <div>Loading Bitcoin heatmap...</div>;
  if (error) return <div>Error loading Bitcoin heatmap: {error.message}</div>;

  const formatData = (data) => {
    return data.map((item) => ({
      time: new Date(item[0]).getHours(),
      day: new Date(item[0]).getDay(),
      value: parseFloat(item[4]), // Close price
    }));
  };

  const formattedData = formatData(data);

  return (
    <div className="w-full h-96">
      <h3 className="text-xl font-bold mb-4">Bitcoin Price Heatmap</h3>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <XAxis type="number" dataKey="time" name="Time" unit="h" domain={[0, 23]} />
          <YAxis
            type="number"
            dataKey="day"
            name="Day"
            domain={[0, 6]}
            tickFormatter={(value) => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][value]}
          />
          <ZAxis type="number" dataKey="value" name="Price" unit="$" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="Bitcoin Price" data={formattedData} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BitcoinHeatmap;