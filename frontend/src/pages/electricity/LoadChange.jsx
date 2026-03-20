import React, { useState } from 'react';

const LoadChangeRequest = ({ consumerId = "MH00112233", currentLoad = "3 kW" }) => {
  const [requestType, setRequestType] = useState('increase'); // 'increase' or 'decrease'
  const [newLoad, setNewLoad] = useState('');
  const [reason, setReason] = useState('');
  
  const [calculatedImpact, setCalculatedImpact] = useState(null);

  const calculateFee = () => {
    // Calculate based on load difference
    setCalculatedImpact({
      difference: Math.abs(parseFloat(newLoad) - parseFloat(currentLoad)),
      estimatedFee: Math.abs(parseFloat(newLoad) - parseFloat(currentLoad)) * 1200,
      newDeposit: parseFloat(newLoad) * 500
    });
  };

  const submitLoadChangeRequest = async () => {
    // Mock API Call
    alert(`Load change request to ${newLoad} kW submitted!`);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-3xl font-bold mb-6">Load Change Request</h2>

      <div className="bg-blue-50 border border-blue-200 p-4 rounded mb-6 text-blue-900">
        <p><strong>Consumer ID:</strong> {consumerId}</p>
        <p><strong>Current Sanctioned Load:</strong> {currentLoad}</p>
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Request Type</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input type="radio" name="reqType" checked={requestType === 'increase'} onChange={() => setRequestType('increase')} />
            Increase Load
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="reqType" checked={requestType === 'decrease'} onChange={() => setRequestType('decrease')} />
            Decrease Load
          </label>
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium">New Requested Load (kW)</label>
        <input 
          type="number" 
          className="w-full p-2 border rounded" 
          value={newLoad}
          onChange={e => setNewLoad(e.target.value)}
          onBlur={calculateFee}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Reason for Change</label>
        <textarea 
          className="w-full p-2 border rounded" 
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="e.g. Added new AC unit..."
        />
      </div>

      {calculatedImpact && parseFloat(newLoad) > 0 && (
        <div className="mb-6 p-4 bg-gray-50 rounded border">
          <h3 className="font-bold mb-2">Estimated Impact</h3>
          <p>Load Difference: {calculatedImpact.difference} kW</p>
          <p>Processing Fee: ₹{calculatedImpact.estimatedFee}</p>
          <p>New Security Deposit Total: ₹{calculatedImpact.newDeposit}</p>
        </div>
      )}

      <button 
        className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700"
        onClick={submitLoadChangeRequest}
      >
        Submit Request
      </button>

    </div>
  );
};

export default LoadChangeRequest;
