import React, { useState } from 'react';

const NewConnectionForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    connectionType: '', // Domestic, Commercial, Industrial, Agricultural
    loadRequirement: '',
    phase: '', // Single Phase, Three Phase
    applicantName: '',
    fatherName: '',
    address: '',
    pincode: '',
    mobile: '',
    email: '',
    aadhaarNumber: '',
    propertyType: '', // Owned, Rented
  });

  const calculateLoadRequirement = () => {
    // Implement load calculator based on appliances
    return "5 kW";
  };

  const fetchFromDigiLocker = async () => {
    // Implement DigiLocker document fetch
    alert("Fetched from DigiLocker!");
  };

  const submitApplication = async () => {
    // Submit to backend
    alert("Application Submitted successfully! Your Application ID is: EL-091238");
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-3xl font-bold mb-6 text-blue-800">New Electricity Connection</h2>
      
      <div className="mb-4">
        <div className="flex justify-between border-b pb-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <span key={s} className={`font-bold ${step === s ? 'text-blue-600' : 'text-gray-400'}`}>Step {s}</span>
          ))}
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Connection Details</h3>
          <select 
            className="w-full p-2 border rounded"
            value={formData.connectionType}
            onChange={(e) => setFormData({...formData, connectionType: e.target.value})}
          >
            <option value="">Select Connection Type</option>
            <option value="Domestic">Domestic</option>
            <option value="Commercial">Commercial</option>
            <option value="Industrial">Industrial</option>
          </select>
          <input 
            type="number" 
            placeholder="Load Requirement (kW)" 
            className="w-full p-2 border rounded"
            value={formData.loadRequirement}
            onChange={(e) => setFormData({...formData, loadRequirement: e.target.value})}
          />
          <button className="text-blue-600 underline text-sm" onClick={() => setFormData({...formData, loadRequirement: "5"})}>Use Load Calculator</button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Applicant Details</h3>
          <input type="text" placeholder="Applicant Name" className="w-full p-2 border rounded" value={formData.applicantName} onChange={e => setFormData({...formData, applicantName: e.target.value})} />
          <input type="text" placeholder="Father's/Husband's Name" className="w-full p-2 border rounded" value={formData.fatherName} onChange={e => setFormData({...formData, fatherName: e.target.value})} />
          <input type="text" placeholder="Mobile" className="w-full p-2 border rounded" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} />
          <input type="email" placeholder="Email" className="w-full p-2 border rounded" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          <input type="text" placeholder="Aadhaar Number" className="w-full p-2 border rounded" value={formData.aadhaarNumber} onChange={e => setFormData({...formData, aadhaarNumber: e.target.value})} />
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Address Details</h3>
          <textarea placeholder="Full Address" className="w-full p-2 border rounded" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
          <input type="text" placeholder="Pincode" className="w-full p-2 border rounded" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} />
          <select className="w-full p-2 border rounded" value={formData.propertyType} onChange={e => setFormData({...formData, propertyType: e.target.value})}>
            <option value="">Property Type</option>
            <option value="Owned">Owned</option>
            <option value="Rented">Rented</option>
          </select>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Documents</h3>
          <button className="w-full bg-green-600 text-white p-2 rounded mb-4" onClick={fetchFromDigiLocker}>Fetch from DigiLocker</button>
          
          <div className="border border-dashed p-4 rounded text-center">
            Upload ID Proof
          </div>
          <div className="border border-dashed p-4 rounded text-center">
            Upload Address Proof
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Review & Payment</h3>
          <p>Application Fee: ₹1500</p>
          <div className="bg-gray-100 p-4 rounded text-sm mb-4">
            <p>Name: {formData.applicantName}</p>
            <p>Load: {formData.loadRequirement} kW</p>
            <p>Type: {formData.connectionType}</p>
          </div>
          <button className="w-full bg-blue-600 text-white p-3 rounded font-bold" onClick={submitApplication}>Pay & Submit</button>
        </div>
      )}

      <div className="mt-8 flex justify-between">
        {step > 1 && <button className="px-6 py-2 bg-gray-200 rounded" onClick={() => setStep(step - 1)}>Back</button>}
        {step < 5 && <button className="px-6 py-2 bg-blue-600 text-white rounded" onClick={() => setStep(step + 1)}>Next</button>}
      </div>
    </div>
  );
};

export default NewConnectionForm;
