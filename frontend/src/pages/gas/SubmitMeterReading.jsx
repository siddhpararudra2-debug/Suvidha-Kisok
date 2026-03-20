import React, { useState, useEffect } from 'react';

// Mock API module for testing if real one is not available
const api = {
  get: async (url) => ({ data: { value: 1200, date: '2025-01-01' } }),
  post: async (url, data) => ({ data: { success: true } })
};
const toast = {
  success: console.log,
  error: console.error
};

const SubmitMeterReading = ({ bpNumber }) => {
  const [reading, setReading] = useState('');
  const [meterImage, setMeterImage] = useState(null);
  const [previousReading, setPreviousReading] = useState(null);
  const [estimatedBill, setEstimatedBill] = useState(null);

  useEffect(() => {
    fetchPreviousReading();
  }, [bpNumber]);

  const fetchPreviousReading = async () => {
    try {
      const response = await api.get(`/gas/previous-reading/${bpNumber}`);
      setPreviousReading(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Validate reading (must be >= previous)
  const validateReading = () => {
    if (parseInt(reading) < previousReading?.value) {
      return { valid: false, message: 'Reading cannot be less than previous' };
    }
    if (parseInt(reading) - previousReading?.value > 500) {
      return { valid: false, message: 'Unusually high consumption. Please verify.' };
    }
    return { valid: true };
  };

  // Calculate estimated bill
  const calculateEstimatedBill = () => {
    const units = parseInt(reading) - previousReading?.value;
    const rate = 45; // ₹ per SCM
    const amount = units * rate;
    const taxes = amount * 0.05;
    setEstimatedBill({ units, amount, taxes, total: amount + taxes });
  };

  // Camera integration for meter photo
  const captureImage = async (e) => {
    if(e.target.files && e.target.files[0]) {
      setMeterImage(e.target.files[0]);
    }
  };

  const submitReading = async () => {
    const validation = validateReading();
    if (!validation.valid) {
      toast.error(validation.message);
      return;
    }

    const formData = new FormData();
    formData.append('bpNumber', bpNumber);
    formData.append('reading', reading);
    if(meterImage) formData.append('meterImage', meterImage);
    formData.append('submissionDate', new Date().toISOString());

    try {
      const response = await api.post('/gas/meter-reading', formData);
      toast.success('Meter reading submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit');
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">Submit Meter Reading</h2>
      
      {previousReading && (
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <p><strong>Previous Reading:</strong> {previousReading.value}</p>
          <p><strong>Date:</strong> {previousReading.date}</p>
        </div>
      )}

      <div className="mb-4">
        <label className="block mb-2 font-medium">New Reading</label>
        <input 
          type="number"
          className="w-full p-2 border rounded"
          value={reading} 
          onChange={(e) => {
            setReading(e.target.value);
            if(e.target.value) calculateEstimatedBill();
          }} 
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Capture Meter Photo</label>
        <input type="file" accept="image/*" capture="environment" onChange={captureImage} className="w-full" />
      </div>

      {estimatedBill && (
        <div className="mb-4 p-3 bg-blue-50 rounded text-blue-800">
          <h3 className="font-bold">Estimated Bill</h3>
          <p>Units: {estimatedBill.units}</p>
          <p>Amount: ₹{estimatedBill.amount}</p>
          <p>Taxes: ₹{estimatedBill.taxes}</p>
          <p className="font-bold mt-2">Total: ₹{estimatedBill.total}</p>
        </div>
      )}

      <button 
        className="w-full bg-blue-600 text-white p-3 rounded font-medium hover:bg-blue-700"
        onClick={submitReading}
      >
        Submit Reading
      </button>
    </div>
  );
};

export default SubmitMeterReading;
