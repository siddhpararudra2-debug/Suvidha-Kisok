import React, { useState, useEffect } from 'react';

// Mock API module for testing if real one is not available
const api = {
  get: async (url) => ({ data: { value: 1200, date: '2025-01-01' } }),
  post: async (url, data) => {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 800));
    return { data: { success: true } };
  }
};

const SubmitMeterReading = ({ bpNumber }) => {
  const [reading, setReading] = useState('');
  const [meterImage, setMeterImage] = useState(null);
  const [previousReading, setPreviousReading] = useState(null);
  const [estimatedBill, setEstimatedBill] = useState(null);
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPreviousReading();
  }, [bpNumber]);

  const fetchPreviousReading = async () => {
    try {
      const response = await api.get(`/gas/previous-reading/${bpNumber}`);
      setPreviousReading(response.data);
    } catch (error) {
      setStatusMsg({ text: 'Failed to fetch previous reading.', type: 'error' });
    }
  };

  // Validate reading (must be >= previous)
  const validateReading = (currentReadingStr) => {
    if (!currentReadingStr) return { valid: false, message: 'Please enter a reading.' };
    const curr = parseInt(currentReadingStr);
    if (isNaN(curr)) return { valid: false, message: 'Invalid number format.' };
    if (previousReading && curr < previousReading.value) {
      return { valid: false, message: `Reading cannot be less than previous (${previousReading.value}).` };
    }
    if (previousReading && (curr - previousReading.value) > 500) {
      return { valid: false, message: 'Unusually high consumption. Please check your reading.' };
    }
    return { valid: true };
  };

  // Calculate estimated bill using the local reading state parameter to guarantee synchrony
  const calculateEstimatedBill = (val) => {
    const curr = parseInt(val);
    if (isNaN(curr) || (previousReading && curr < previousReading.value)) {
        setEstimatedBill(null);
        return;
    }
    const units = curr - (previousReading?.value || 0);
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
    setStatusMsg({ text: '', type: '' });
    const validation = validateReading(reading);
    
    if (!validation.valid) {
      setStatusMsg({ text: validation.message, type: 'error' });
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('bpNumber', bpNumber);
    formData.append('reading', reading);
    if(meterImage) formData.append('meterImage', meterImage);
    formData.append('submissionDate', new Date().toISOString());

    try {
      await api.post('/gas/meter-reading', formData);
      setStatusMsg({ text: 'Meter reading submitted successfully! Our agents will verify it shortly.', type: 'success' });
      setReading('');
      setEstimatedBill(null);
    } catch (error) {
      setStatusMsg({ text: 'Failed to submit reading. Please try again.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4">Submit Meter Reading</h2>
      
      {statusMsg.text && (
        <div className={`mb-4 p-3 rounded font-medium ${statusMsg.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
          {statusMsg.type === 'error' ? '⚠️ ' : '✅ '}
          {statusMsg.text}
        </div>
      )}

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
            calculateEstimatedBill(e.target.value);
            if (statusMsg.type === 'error') setStatusMsg({ text: '', type: '' });
          }} 
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-medium">Capture Meter Photo</label>
        <input type="file" accept="image/*" capture="environment" onChange={captureImage} className="w-full" />
      </div>

      {estimatedBill && estimatedBill.units >= 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded text-blue-800">
          <h3 className="font-bold">Estimated Bill</h3>
          <p>Units: {estimatedBill.units}</p>
          <p>Amount: ₹{estimatedBill.amount}</p>
          <p>Taxes: ₹{estimatedBill.taxes}</p>
          <p className="font-bold mt-2">Total: ₹{estimatedBill.total.toFixed(2)}</p>
        </div>
      )}

      <button 
        className={`w-full text-white p-3 rounded font-medium transition-colors ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        onClick={submitReading}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Reading'}
      </button>
    </div>
  );
};

export default SubmitMeterReading;
