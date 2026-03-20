import React, { useState } from 'react';

const api = {
  get: async () => ({ data: { covered: true, expectedDate: null, provider: 'MGL' } }),
  post: async () => ({ data: { applicationId: 'APP123', estimatedInstallationDate: '2025-05-01' } })
};

const GasNewConnection = () => {
  const [connectionType, setConnectionType] = useState(''); // PNG, CNG Vehicle
  const [step, setStep] = useState(1);
  const [coverageStatus, setCoverageStatus] = useState(null);
  const [formData, setFormData] = useState({ pincode: '', address: '' });

  // Step 1: Check Coverage Area
  const checkCoverage = async () => {
    const response = await api.get('/gas/check-coverage', {
      params: { pincode: formData.pincode, address: formData.address }
    });
    setCoverageStatus(response.data);
  };

  const submitApplication = async () => {
    const response = await api.post('/gas/new-connection', formData);
    alert(`Application Submitted! ID: ${response.data.applicationId}`);
  };

  return (
    <div className="p-4 bg-white rounded shadow-sm max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">New Gas Connection</h2>
      
      {step === 1 && (
        <div>
          <h3 className="text-lg font-medium mb-2">Check Coverage</h3>
          <input 
            type="text" 
            placeholder="Pincode" 
            className="w-full p-2 border rounded mb-2"
            value={formData.pincode}
            onChange={e => setFormData({...formData, pincode: e.target.value})}
          />
          <button 
            className="w-full bg-blue-600 text-white p-2 rounded"
            onClick={async () => {
              await checkCoverage();
              setStep(2);
            }}
          >
            Check Availability
          </button>
        </div>
      )}

      {step === 2 && coverageStatus && (
        <div>
          <div className={`p-4 rounded mb-4 ${coverageStatus.covered ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {coverageStatus.covered ? 'Area is covered by ' + coverageStatus.provider : 'Not covered in this area yet.'}
          </div>
          {coverageStatus.covered && (
            <div>
              <label className="block mb-2 font-medium">Connection Type</label>
              <select 
                className="w-full p-2 border rounded mb-4"
                value={connectionType}
                onChange={e => setConnectionType(e.target.value)}
              >
                <option value="">Select...</option>
                <option value="Domestic PNG">Domestic PNG</option>
                <option value="Commercial PNG">Commercial PNG</option>
                <option value="Industrial PNG">Industrial PNG</option>
              </select>
              
              <button 
                className="w-full bg-blue-600 text-white p-2 rounded"
                onClick={submitApplication}
              >
                Submit Application
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GasNewConnection;
