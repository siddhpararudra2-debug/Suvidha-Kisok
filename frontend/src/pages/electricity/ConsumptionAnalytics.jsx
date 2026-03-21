import React, { useState, useEffect } from 'react';
import { getConsumptionAnalytics } from '../../services/electricityService';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { jsPDF } from 'jspdf';

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

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    if (!data) return;
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.text("Consumption Analytics Report", 20, 20);
    
    doc.setFontSize(14);
    doc.text(`Estimated Next Bill: Rs ${data.nextBillPrediction}`, 20, 40);
    doc.text(`Peak Usage Time: ${data.peakUsageTime}`, 20, 50);
    doc.text(`Goal Target: ${data.similarHouseholdsTarget} units/mo`, 20, 60);

    doc.text("Monthly Consumption:", 20, 80);
    let y = 90;
    data.monthlyConsumption.forEach((item) => {
        doc.text(`${item.month}: ${item.units} units`, 30, y);
        y += 10;
    });

    doc.text("Recommendations:", 20, y + 10);
    y += 20;
    data.recommendations.forEach((rec) => {
        doc.text(`- ${rec}`, 30, y);
        y += 10;
    });

    doc.save("Consumption_Report.pdf");
  };

  if (loading) return <div>Loading Analytics...</div>;
  if (!data) return <div>No data available</div>;

  return (
    <div className="p-4 max-w-5xl mx-auto" id="analytics-report">
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
        <div className="bg-white p-4 rounded shadow print-friendly">
          <h3 className="text-gray-500 font-medium">Estimated Next Bill</h3>
          <p className="text-3xl font-bold text-blue-600">₹{data.nextBillPrediction}</p>
        </div>
        <div className="bg-white p-4 rounded shadow print-friendly">
          <h3 className="text-gray-500 font-medium">Peak Usage Time</h3>
          <p className="text-xl font-bold">{data.peakUsageTime}</p>
        </div>
        <div className="bg-white p-4 rounded shadow print-friendly">
          <h3 className="text-gray-500 font-medium">Goal Setting</h3>
          <p className="text-xl font-bold">Aim for {data.similarHouseholdsTarget} units/mo</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow mb-8">
        <h3 className="text-xl font-bold mb-4">Monthly Trends</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.monthlyConsumption}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip cursor={{ fill: '#f3f4f6' }} />
              <Bar dataKey="units" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Units (kWh)" />
            </BarChart>
          </ResponsiveContainer>
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
      
      <div className="mt-8 flex gap-4 no-print">
        <button onClick={handlePrint} className="bg-gray-100 border p-2 rounded hover:bg-gray-200 cursor-pointer">🖨️ Print Report</button>
        <button onClick={handleDownloadPDF} className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 cursor-pointer">⬇️ Download PDF</button>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background-color: white !important; }
          #analytics-report { padding: 0 !important; margin: 0 !important; }
          .print-friendly { break-inside: avoid; border: 1px solid #e5e7eb; margin-bottom: 20px; }
        }
      `}</style>
    </div>
  );
};

export default ConsumptionAnalytics;
