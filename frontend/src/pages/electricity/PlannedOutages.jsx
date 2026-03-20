import React, { useState, useEffect } from 'react';

const api = {
  get: async () => ({
    data: [
      { id: 1, area: 'Borivali West', date: '2026-03-25', time: '10:00 AM - 02:00 PM', reason: 'Transformer Upgrade', affectedConsumers: 250 },
      { id: 2, area: 'Andheri East', date: '2026-03-28', time: '11:00 AM - 04:00 PM', reason: 'Line Maintenance', affectedConsumers: 150 }
    ]
  })
};

const PlannedOutages = ({ userLocation = { area: 'Borivali West' } }) => {
  const [outages, setOutages] = useState([]);
  const [filter, setFilter] = useState({
    dateRange: 'next7days',
    area: userLocation?.area || 'all'
  });

  useEffect(() => {
    fetchPlannedOutages();
  }, [filter]);

  const fetchPlannedOutages = async () => {
    try {
      const response = await api.get('/electricity/planned-outages', { params: filter });
      setOutages(response.data);
    } catch (e) {
      console.error(e);
    }
  };

  const OutageList = ({ data }) => (
    <div className="space-y-4">
      {data.map(outage => (
        <div key={outage.id} className="p-4 border border-red-200 bg-red-50 rounded shadow-sm">
          <h4 className="text-xl font-bold text-red-800">{outage.area}</h4>
          <p><strong>Date & Time:</strong> {outage.date} | {outage.time}</p>
          <p><strong>Reason:</strong> {outage.reason}</p>
          <p><strong>Affected:</strong> ~{outage.affectedConsumers} consumers</p>
        </div>
      ))}
      {data.length === 0 && <p className="text-gray-500">No planned outages found for selected criteria.</p>}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-3xl font-bold mb-6 text-red-600">⚠ Planned Outages</h2>
      
      <div className="flex gap-4 mb-6">
        <select 
          className="flex-1 p-2 border rounded"
          value={filter.area}
          onChange={e => setFilter({...filter, area: e.target.value})}
        >
          <option value="all">All Areas</option>
          <option value="Borivali West">Borivali West</option>
          <option value="Andheri East">Andheri East</option>
        </select>
        
        <select 
          className="flex-1 p-2 border rounded"
          value={filter.dateRange}
          onChange={e => setFilter({...filter, dateRange: e.target.value})}
        >
          <option value="next7days">Next 7 Days</option>
          <option value="next30days">Next 30 Days</option>
        </select>
      </div>

      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-4">Outage Schedule</h3>
        <OutageList data={outages} />
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded">
        <h4 className="font-bold text-blue-900 mb-2">Subscribe to Notifications</h4>
        <p className="mb-2">Get SMS alerts for outages in your area.</p>
        <div className="flex gap-2">
          <input type="text" placeholder="Mobile Number" className="flex-1 p-2 border rounded" />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Subscribe</button>
        </div>
      </div>
    </div>
  );
};

export default PlannedOutages;
