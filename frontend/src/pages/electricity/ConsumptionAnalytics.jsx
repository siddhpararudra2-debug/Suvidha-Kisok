import React, { useState, useEffect } from 'react';
import { getConsumptionAnalytics } from '../../services/electricityService';

const ConsumptionAnalytics = ({ consumerId = "MH12345678" }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('12months');

  useEffect(() => {
    fetchConsumptionData();
  }, [consumerId, period]);

  const fetchConsumptionData = async () => {
    setLoading(true);
    try {
      const result = await getConsumptionAnalytics(consumerId, period);
      setData(result);
    } catch (error) {
      console.error('Failed to load consumption data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading Analytics...</div>;
  if (!data) return <div>No data available</div>;

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Consumption Analytics</h2>
        <select 
          className="p-2 border rounded"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        >
          <option value="6months">Last 6 Months</option>
          <option value="12months">Last 12 Months</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500 font-medium">Estimated Next Bill</h3>
          <p className="text-3xl font-bold text-blue-600">₹{data.nextBillPrediction}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500 font-medium">Peak Usage Time</h3>
          <p className="text-xl font-bold">{data.peakUsageTime}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-gray-500 font-medium">Goal Setting</h3>
          <p className="text-xl font-bold">Aim for {data.similarHouseholdsTarget} units/mo</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow mb-8">
        <h3 className="text-xl font-bold mb-4">Monthly Trends</h3>
        <div className="flex gap-2 items-end h-[200px]">
          {data.monthlyConsumption.map((item, idx) => (
            <div key={idx} className="flex-1 flex flex-col justify-end items-center group relative">
              <span className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-gray-800 text-white p-1 rounded text-xs transition-opacity">{item.units}</span>
              <div 
                style={{ height: `${(item.units / 250) * 100}%` }}
                className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors"
                title={`${item.units} units`}
              ></div>
              <span className="text-sm mt-2">{item.month}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-xl font-bold mb-4">Energy Saving Recommendations</h3>
        <ul className="list-disc pl-6 space-y-2">
          {data.recommendations.map((rec, idx) => (
            <li key={idx} className="text-lg">{rec}</li>
          ))}
        </ul>
      </div>
      
      <div className="mt-8 flex gap-4">
        <button className="bg-gray-100 border p-2 rounded hover:bg-gray-200">🖨️ Print Report</button>
        <button className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">⬇️ Download PDF</button>
      </div>
    </div>
  );
};

export default ConsumptionAnalytics;
