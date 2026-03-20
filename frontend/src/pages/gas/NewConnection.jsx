import React, { useState } from 'react';

const SURAT_PINCODES = {
  '395001': 'Athwa Lines',
  '395002': 'Sagrampura',
  '395003': 'Varachha',
  '395004': 'Katargam',
  '395005': 'Rander',
  '395007': 'Vesu / Piplod',
  '395008': 'Bhatar',
  '395009': 'Adajan',
  '394210': 'Udhna'
};

const GasNewConnection = () => {
  const [connectionType, setConnectionType] = useState('');
  const [step, setStep] = useState(1);
  const [coverageStatus, setCoverageStatus] = useState(null);
  const [formData, setFormData] = useState({ pincode: '', address: '' });
  const [areaMsg, setAreaMsg] = useState('');

  const handlePincodeChange = (e) => {
    let val = e.target.value.replace(/\D/g, ''); // Extract only numbers
    if (val.length > 6) val = val.substring(0, 6); // Limit to 6 digits
    
    setFormData({ ...formData, pincode: val });
    
    // Auto-detect area
    if (val.length === 6) {
      if (SURAT_PINCODES[val]) {
        setAreaMsg(`Detected Area: ${SURAT_PINCODES[val]}`);
      } else if (val.startsWith('395') || val.startsWith('394')) {
        setAreaMsg('Detected Area: Surat Region (Other)');
      } else {
        setAreaMsg('Area outside Surat coverage limits.');
      }
    } else {
      setAreaMsg('');
    }
  };

  const checkCoverage = async () => {
    // Mock API determination based on pincode
    const isSurat = formData.pincode.startsWith('395') || formData.pincode.startsWith('394');
    
    if (formData.pincode.length !== 6) {
      alert("Please enter a valid 6-digit Pincode");
      return;
    }

    setCoverageStatus({
      covered: isSurat,
      expectedDate: isSurat ? 'Available Now' : null,
      provider: isSurat ? 'Gujarat Gas Ltd' : null
    });
    setStep(2);
  };

  const submitApplication = async () => {
    // Simulate API delay
    await new Promise(r => setTimeout(r, 600));
    alert(`Application Submitted Successfully! Your tracking ID is: APP-GJ-${Math.floor(Math.random() * 8999 + 1000)}`);
  };

  return (
    <div className="p-4 bg-white rounded shadow-sm max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">New Gas Connection</h2>
      
      {step === 1 && (
        <div>
          <h3 className="text-lg font-medium mb-2">Check Coverage Area</h3>
          <p className="text-sm text-gray-500 mb-4">Service exclusively available in Surat regions (e.g. 395009 for Adajan).</p>
          
          <div className="mb-4">
            <input 
              type="text" 
              placeholder="Enter 6-digit Pincode" 
              className="w-full p-2 border rounded"
              value={formData.pincode}
              onChange={handlePincodeChange}
            />
            {areaMsg && (
              <p className={`text-sm mt-1 font-medium ${areaMsg.includes('outside') ? 'text-red-500' : 'text-blue-600'}`}>
                {areaMsg}
              </p>
            )}
          </div>
          
          <button 
            className={`w-full text-white p-2 rounded transition-colors ${formData.pincode.length === 6 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'}`}
            onClick={checkCoverage}
            disabled={formData.pincode.length !== 6}
          >
            Check Availability
          </button>
        </div>
      )}

      {step === 2 && coverageStatus && (
        <div>
          <div className={`p-4 rounded border mb-4 ${coverageStatus.covered ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
            <p className="font-bold flex items-center gap-2">
              {coverageStatus.covered ? '✅ Service Available' : '❌ Service Not Available'}
            </p>
            <p className="mt-1">
              {coverageStatus.covered 
                ? `Your area (${SURAT_PINCODES[formData.pincode] || 'Surat Region'}) is covered by ${coverageStatus.provider}.` 
                : 'Sorry, your pincode does not fall under Surat coverage network.'}
            </p>
          </div>

          {coverageStatus.covered && (
            <div className="mt-6 border-t pt-4">
              <label className="block mb-2 font-medium">Select Connection Type</label>
              <select 
                className="w-full p-2 border rounded mb-4 focus:ring-2 focus:ring-blue-500"
                value={connectionType}
                onChange={e => setConnectionType(e.target.value)}
              >
                <option value="">-- Choose Type --</option>
                <option value="Domestic PNG">Domestic PNG</option>
                <option value="Commercial PNG">Commercial PNG</option>
                <option value="Industrial PNG">Industrial PNG</option>
              </select>
              
              <button 
                className={`w-full text-white p-3 rounded font-medium transition-colors ${connectionType ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300 cursor-not-allowed'}`}
                onClick={submitApplication}
                disabled={!connectionType}
              >
                Submit Application
              </button>
            </div>
          )}
          
          <button 
            className="mt-4 text-sm text-gray-500 underline hover:text-gray-700 w-full text-center"
            onClick={() => { setStep(1); setFormData({...formData, pincode: ''}); setAreaMsg(''); }}
          >
            Check another pincode
          </button>
        </div>
      )}
    </div>
  );
};

export default GasNewConnection;
