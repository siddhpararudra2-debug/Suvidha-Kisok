import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Shield, Bell, Lock, Save, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';

const tabs = [
    { id: 'account', name: 'Account', icon: User },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'system', name: 'System Config', icon: SettingsIcon },
];

const Settings: React.FC = () => {
    const [activeTab, setActiveTab] = useState('account');
    const { user } = useSelector((state: RootState) => state.auth);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        await new Promise(r => setTimeout(r, 1000));
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
                <p className="text-gray-500 text-sm mt-1">Manage your account and system configuration</p>
            </div>

            <div className="flex gap-6">
                {/* Tabs */}
                <div className="w-64 bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-fit">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={clsx('w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 font-medium text-left', activeTab === tab.id ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50')}>
                                <Icon size={18} /> {tab.name}
                            </button>
                        );
                    })}
                </div>

                {/* Content */}
                <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    {activeTab === 'account' && (
                        <div className="space-y-6">
                            <h3 className="font-semibold text-lg">Account Information</h3>
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-2xl font-bold text-primary-700">
                                    {user?.name?.charAt(0) || 'A'}
                                </div>
                                <div>
                                    <p className="font-medium text-lg">{user?.name || 'Admin User'}</p>
                                    <p className="text-sm text-gray-500">{user?.department || 'Administration'}</p>
                                    <span className="inline-block mt-1 px-2 py-0.5 bg-primary-100 text-primary-700 rounded text-xs font-medium">{user?.role || 'District Officer'}</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label><input type="text" defaultValue={user?.name || 'Admin User'} className="w-full px-3 py-2 border rounded-lg" /></div>
                                <div><label className="block text-sm font-medium text-gray-600 mb-1">Department</label><input type="text" defaultValue={user?.department || ''} className="w-full px-3 py-2 border rounded-lg" /></div>
                                <div><label className="block text-sm font-medium text-gray-600 mb-1">Designation</label><input type="text" defaultValue={user?.designation || ''} className="w-full px-3 py-2 border rounded-lg" /></div>
                                <div><label className="block text-sm font-medium text-gray-600 mb-1">Employee ID</label><input type="text" defaultValue={user?.employee_id || ''} disabled className="w-full px-3 py-2 border rounded-lg bg-gray-50" /></div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            <h3 className="font-semibold text-lg">Security Settings</h3>
                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                                <CheckCircle className="text-green-600" size={20} />
                                <span className="text-green-700">Two-factor authentication is enabled</span>
                            </div>
                            <div>
                                <h4 className="font-medium mb-3">Change Password</h4>
                                <div className="space-y-3 max-w-md">
                                    <div><label className="block text-sm mb-1">Current Password</label><input type="password" className="w-full px-3 py-2 border rounded-lg" /></div>
                                    <div><label className="block text-sm mb-1">New Password</label><input type="password" className="w-full px-3 py-2 border rounded-lg" /></div>
                                    <div><label className="block text-sm mb-1">Confirm Password</label><input type="password" className="w-full px-3 py-2 border rounded-lg" /></div>
                                </div>
                            </div>
                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                <div className="flex items-center gap-2 mb-2"><AlertTriangle className="text-amber-600" size={18} /><span className="font-medium text-amber-800">Session Settings</span></div>
                                <p className="text-sm text-amber-700">Sessions expire after 30 minutes of inactivity as per security policy.</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="space-y-6">
                            <h3 className="font-semibold text-lg">Notification Preferences</h3>
                            {[
                                { label: 'New complaint assigned', desc: 'Receive alerts for new assignments' },
                                { label: 'Complaint escalated', desc: 'Get notified when SLA is breached' },
                                { label: 'Daily summary report', desc: 'Receive email at 9 AM daily' },
                                { label: 'System alerts', desc: 'Kiosk offline, maintenance due' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium">{item.label}</p>
                                        <p className="text-sm text-gray-500">{item.desc}</p>
                                    </div>
                                    <label className="relative inline-flex cursor-pointer">
                                        <input type="checkbox" defaultChecked={i < 3} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-checked:bg-primary-600 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'system' && (
                        <div className="space-y-6">
                            <h3 className="font-semibold text-lg">System Configuration</h3>
                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3">
                                <Lock className="text-amber-600" size={18} />
                                <span className="text-amber-700">Super Admin access required for system configuration changes</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium mb-1">Session Timeout (min)</label><input type="number" defaultValue={30} disabled className="w-full px-3 py-2 border rounded-lg bg-gray-50" /></div>
                                <div><label className="block text-sm font-medium mb-1">SLA Default (hours)</label><input type="number" defaultValue={72} disabled className="w-full px-3 py-2 border rounded-lg bg-gray-50" /></div>
                            </div>
                        </div>
                    )}

                    {/* Save Button */}
                    <div className="flex items-center gap-4 mt-6 pt-6 border-t">
                        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium disabled:opacity-50">
                            {saving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                        {saved && <span className="text-green-600 flex items-center gap-1"><CheckCircle size={16} /> Saved!</span>}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Settings;
