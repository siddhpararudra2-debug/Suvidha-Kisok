import React, { useState } from 'react';
import {
    Zap,
    Flame,
    Droplets,
    FileText,
    Upload,
    Download,
    Calculator,
    Search,
    RefreshCw,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import clsx from 'clsx';

interface BillData {
    consumerId: string;
    consumerName: string;
    previousReading: number;
    currentReading: number;
    unitsConsumed: number;
    billAmount: number;
}

const tariffs = {
    electricity: [
        { range: '0-100', rate: 6.50 },
        { range: '101-300', rate: 7.50 },
        { range: '301-500', rate: 8.50 },
        { range: '500+', rate: 9.50 },
    ],
    gas: [
        { range: 'Domestic', rate: 45.25 },
        { range: 'Commercial', rate: 52.00 },
    ],
    water: [
        { range: '0-10 kL', rate: 8.00 },
        { range: '10-20 kL', rate: 12.00 },
        { range: '20+ kL', rate: 18.00 },
    ],
};

const UtilityData: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'billing' | 'bulk' | 'tariff'>('billing');
    const [serviceType, setServiceType] = useState<'electricity' | 'gas' | 'water'>('electricity');

    // Bill Generation State
    const [consumerId, setConsumerId] = useState('');
    const [consumerName, setConsumerName] = useState('');
    const [previousReading, setPreviousReading] = useState('');
    const [currentReading, setCurrentReading] = useState('');
    const [readingDate, setReadingDate] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [billPreview, setBillPreview] = useState<BillData | null>(null);
    const [generating, setGenerating] = useState(false);
    const [success, setSuccess] = useState(false);

    const calculateBill = () => {
        const prev = parseFloat(previousReading) || 0;
        const curr = parseFloat(currentReading) || 0;
        const units = curr - prev;

        let amount = 0;

        if (serviceType === 'electricity') {
            if (units <= 100) amount = units * 6.5;
            else if (units <= 300) amount = 100 * 6.5 + (units - 100) * 7.5;
            else if (units <= 500) amount = 100 * 6.5 + 200 * 7.5 + (units - 300) * 8.5;
            else amount = 100 * 6.5 + 200 * 7.5 + 200 * 8.5 + (units - 500) * 9.5;

            // Add fixed charges and taxes
            amount += 150; // Fixed charge
            amount += amount * 0.05; // Fuel adjustment
            amount += amount * 0.05; // Duty
            amount += amount * 0.18; // Tax
        } else if (serviceType === 'gas') {
            amount = units * 45.25;
            amount += amount * 0.18; // GST
        } else {
            if (units <= 10) amount = units * 8;
            else if (units <= 20) amount = 10 * 8 + (units - 10) * 12;
            else amount = 10 * 8 + 10 * 12 + (units - 20) * 18;

            amount += 50; // Sewage charge
            amount += amount * 0.18; // Tax
        }

        setBillPreview({
            consumerId,
            consumerName: consumerName || 'Consumer',
            previousReading: prev,
            currentReading: curr,
            unitsConsumed: units,
            billAmount: Math.round(amount * 100) / 100
        });
    };

    const handleGenerateBill = async () => {
        setGenerating(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setGenerating(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
    };

    const fetchConsumer = async () => {
        // Mock fetch - in production, call API
        if (consumerId) {
            setConsumerName('Rajesh Kumar');
            setPreviousReading('1250');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Utility Data Management</h1>
                <p className="text-gray-500 text-sm mt-1">
                    Generate bills, upload readings, manage tariffs
                </p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 flex gap-1">
                <button
                    onClick={() => setActiveTab('billing')}
                    className={clsx(
                        'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors',
                        activeTab === 'billing' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                    )}
                >
                    <Calculator size={18} />
                    Bill Generation
                </button>
                <button
                    onClick={() => setActiveTab('bulk')}
                    className={clsx(
                        'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors',
                        activeTab === 'bulk' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                    )}
                >
                    <Upload size={18} />
                    Bulk Upload
                </button>
                <button
                    onClick={() => setActiveTab('tariff')}
                    className={clsx(
                        'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors',
                        activeTab === 'tariff' ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                    )}
                >
                    <FileText size={18} />
                    Tariff Management
                </button>
            </div>

            {/* Service Type Selector */}
            <div className="flex gap-3">
                {(['electricity', 'gas', 'water'] as const).map((type) => (
                    <button
                        key={type}
                        onClick={() => setServiceType(type)}
                        className={clsx(
                            'flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm border transition-colors',
                            serviceType === type
                                ? type === 'electricity' ? 'bg-yellow-50 border-yellow-300 text-yellow-700' :
                                    type === 'gas' ? 'bg-orange-50 border-orange-300 text-orange-700' :
                                        'bg-blue-50 border-blue-300 text-blue-700'
                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        )}
                    >
                        {type === 'electricity' && <Zap size={16} />}
                        {type === 'gas' && <Flame size={16} />}
                        {type === 'water' && <Droplets size={16} />}
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                ))}
            </div>

            {/* Bill Generation Tab */}
            {activeTab === 'billing' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Form */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">Generate Bill</h3>

                        <div className="space-y-4">
                            {/* Consumer ID */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Consumer ID</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={consumerId}
                                        onChange={(e) => setConsumerId(e.target.value)}
                                        placeholder="Enter Consumer ID"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    />
                                    <button
                                        onClick={fetchConsumer}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                                    >
                                        <Search size={18} />
                                    </button>
                                </div>
                            </div>

                            {consumerName && (
                                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <p className="text-sm text-green-600">Consumer Found</p>
                                    <p className="font-medium text-green-800">{consumerName}</p>
                                </div>
                            )}

                            {/* Readings */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Previous Reading</label>
                                    <input
                                        type="number"
                                        value={previousReading}
                                        onChange={(e) => setPreviousReading(e.target.value)}
                                        placeholder="0"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Current Reading</label>
                                    <input
                                        type="number"
                                        value={currentReading}
                                        onChange={(e) => setCurrentReading(e.target.value)}
                                        placeholder="0"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>
                            </div>

                            {/* Dates */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Reading Date</label>
                                    <input
                                        type="date"
                                        value={readingDate}
                                        onChange={(e) => setReadingDate(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Due Date</label>
                                    <input
                                        type="date"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={calculateBill}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                                >
                                    <Calculator size={18} />
                                    Calculate
                                </button>
                                <button
                                    onClick={handleGenerateBill}
                                    disabled={!billPreview || generating}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium disabled:opacity-50"
                                >
                                    {generating ? <RefreshCw size={18} className="animate-spin" /> : <FileText size={18} />}
                                    {generating ? 'Generating...' : 'Generate Bill'}
                                </button>
                            </div>

                            {success && (
                                <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                                    <CheckCircle size={18} className="text-green-600" />
                                    <span className="text-green-700 font-medium">Bill generated successfully!</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-semibold text-gray-800 mb-4">Bill Preview</h3>

                        {billPreview ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Consumer</p>
                                            <p className="font-medium">{billPreview.consumerName}</p>
                                            <p className="text-sm text-gray-500">{billPreview.consumerId}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">Service</p>
                                            <p className="font-medium capitalize">{serviceType}</p>
                                        </div>
                                    </div>
                                </div>

                                <table className="w-full text-sm">
                                    <tbody className="divide-y divide-gray-100">
                                        <tr>
                                            <td className="py-2 text-gray-500">Previous Reading</td>
                                            <td className="py-2 text-right font-medium">{billPreview.previousReading} units</td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 text-gray-500">Current Reading</td>
                                            <td className="py-2 text-right font-medium">{billPreview.currentReading} units</td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 text-gray-500">Units Consumed</td>
                                            <td className="py-2 text-right font-bold text-primary-600">{billPreview.unitsConsumed} units</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <div className="p-4 bg-primary-50 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <span className="text-primary-700 font-medium">Total Amount</span>
                                        <span className="text-2xl font-bold text-primary-700">₹{billPreview.billAmount.toLocaleString()}</span>
                                    </div>
                                    <p className="text-xs text-primary-600 mt-1">Inclusive of all taxes and charges</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-gray-400 py-12">
                                <Calculator size={48} className="mx-auto mb-3 opacity-50" />
                                <p>Enter readings and click Calculate to preview bill</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Bulk Upload Tab */}
            {activeTab === 'bulk' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Bulk Meter Reading Upload</h3>

                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-primary-400 transition-colors">
                        <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600 mb-2">Drag and drop Excel file here, or click to browse</p>
                        <p className="text-sm text-gray-400 mb-4">Supported: .xlsx, .xls, .csv</p>
                        <input type="file" className="hidden" id="bulk-upload" accept=".xlsx,.xls,.csv" />
                        <label
                            htmlFor="bulk-upload"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 cursor-pointer font-medium"
                        >
                            <Upload size={18} />
                            Select File
                        </label>
                    </div>

                    <div className="mt-6 flex gap-4">
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium">
                            <Download size={18} />
                            Download Template
                        </button>
                    </div>
                </div>
            )}

            {/* Tariff Tab */}
            {activeTab === 'tariff' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-semibold text-gray-800 mb-4 capitalize">{serviceType} Tariff Rates</h3>

                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Range / Category</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Rate (₹)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {tariffs[serviceType].map((t, i) => (
                                <tr key={i}>
                                    <td className="px-4 py-3 font-medium">{t.range}</td>
                                    <td className="px-4 py-3">₹{t.rate.toFixed(2)} / {serviceType === 'gas' ? 'SCM' : serviceType === 'water' ? 'kL' : 'unit'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                        <AlertCircle size={20} className="text-amber-600 mt-0.5" />
                        <div>
                            <p className="font-medium text-amber-800">Tariff updates require approval</p>
                            <p className="text-sm text-amber-600">Contact Super Admin to modify tariff rates</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UtilityData;
