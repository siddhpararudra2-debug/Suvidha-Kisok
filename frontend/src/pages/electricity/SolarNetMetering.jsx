import React, { useState } from 'react';

const SolarNetMetering = ({ consumerId = 'MH1122' }) => {
  const [step, setStep] = useState(1);
  const [eligibility, setEligibility] = useState(null);
  const [formData, setFormData] = useState({
    rooftopArea: '',
    proposedCapacity: '',
    inverterType: 'String',
    panelType: 'Monocrystalline',
  });

  const checkEligibility = async () => {
    // Check sanctioned load and property type
    setEligibility({ status: 'Eligible', maxCapacity: '10 kW' });
    setStep(2);
  };

  const calculateOptimalCapacity = () => {
    return parseFloat(formData.rooftopArea) * 0.1; // 10 sq ft = 1 kW approx
  };

  const submitApplication = () => {
    alert("Solar Net Metering Application Submitted!");
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-3xl font-bold mb-6 text-yellow-600">Solar Net Metering Application</h2>
      
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Eligibility Check</h3>
          <p>Consumer ID: {consumerId}</p>
          <button className="bg-blue-600 text-white p-2 rounded" onClick={checkEligibility}>Ensure Eligibility</button>
        </div>
      )}

      {step === 2 && eligibility && (
        <div className="space-y-4">
          <div className="bg-green-100 text-green-800 p-4 rounded">
            You are {eligibility.status}!
            <br />Max Sanctioned Capacity: {eligibility.maxCapacity}
          </div>
          
          <h3 className="text-xl font-bold">Capacity Calculator</h3>
          <input 
            type="number" 
            placeholder="Available Rooftop Area (sq ft)" 
            className="w-full p-2 border rounded"
            value={formData.rooftopArea}
            onChange={(e) => setFormData({...formData, rooftopArea: e.target.value})}
          />
          {formData.rooftopArea && (
            <p className="font-bold text-gray-700">Estimated capacity: {calculateOptimalCapacity()} kW</p>
          )}

          <h3 className="text-xl font-bold mt-4">Technical Details</h3>
          <select className="w-full p-2 border rounded" value={formData.panelType} onChange={e => setFormData({...formData, panelType: e.target.value})}>
            <option value="Monocrystalline">Monocrystalline</option>
            <option value="Polycrystalline">Polycrystalline</option>
            <option value="Thin-Film">Thin-Film</option>
          </select>

          <button className="bg-blue-600 text-white p-2 rounded w-full mt-4" onClick={() => setStep(3)}>Next: Documents</button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Document Upload</h3>
          <div className="border border-dashed p-4 rounded text-center mb-4">
            Upload Rooftop Photos
          </div>
          <div className="border border-dashed p-4 rounded text-center mb-4">
            Upload ID Proof
          </div>
          
          <button className="w-full bg-blue-600 text-white p-3 rounded font-bold" onClick={submitApplication}>Submit Application</button>
        </div>
      )}
    </div>
  );
};

export default SolarNetMetering;
