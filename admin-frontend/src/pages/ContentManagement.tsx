import React, { useState } from 'react';
import { Megaphone, Book, Users, Plus, Edit, Trash2, X, Save } from 'lucide-react';
import clsx from 'clsx';

type Tab = 'announcements' | 'schemes' | 'officials';

interface Announcement {
    id: number; title: string; content: string; priority: 'high' | 'normal'; active: boolean; createdAt: string;
}

interface Scheme {
    id: number; name: string; category: string; eligibility: string; benefits: string; active: boolean;
}

interface Official {
    id: number; name: string; designation: string; department: string; contact: string; email: string;
}

const mockAnnouncements: Announcement[] = [
    { id: 1, title: 'System Maintenance Scheduled', content: 'Scheduled maintenance on Feb 5th, 2AM-6AM.', priority: 'high', active: true, createdAt: '2026-01-28' },
    { id: 2, title: 'New Bill Payment Options', content: 'Now pay through UPI at all kiosks.', priority: 'normal', active: true, createdAt: '2026-01-25' },
];

const mockSchemes: Scheme[] = [
    { id: 1, name: 'PM Ujjwala Yojana', category: 'Gas', eligibility: 'BPL Households', benefits: 'Free LPG connection', active: true },
    { id: 2, name: 'Jal Jeevan Mission', category: 'Water', eligibility: 'All rural households', benefits: 'Tap water connection', active: true },
];

const mockOfficials: Official[] = [
    { id: 1, name: 'Mr. Rajesh Singh', designation: 'District Collector', department: 'Administration', contact: '+91-9876543210', email: 'dc@suvidha.gov.in' },
    { id: 2, name: 'Mrs. Priya Sharma', designation: 'Executive Engineer', department: 'Water Board', contact: '+91-9876543211', email: 'ee-water@suvidha.gov.in' },
];

const ContentManagement: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('announcements');
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState<any>(null);

    const openAdd = () => { setEditItem(null); setShowModal(true); };
    const openEdit = (item: any) => { setEditItem(item); setShowModal(true); };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Content Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage announcements, schemes, and official contacts</p>
                </div>
                <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium">
                    <Plus size={18} /> Add New
                </button>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-1 flex gap-1">
                {[
                    { id: 'announcements', label: 'Announcements', icon: Megaphone },
                    { id: 'schemes', label: 'Schemes', icon: Book },
                    { id: 'officials', label: 'Officials', icon: Users },
                ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id as Tab)} className={clsx('flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm', activeTab === tab.id ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100')}>
                            <Icon size={18} /> {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Announcements */}
            {activeTab === 'announcements' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50"><tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Title</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Priority</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Date</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Actions</th>
                        </tr></thead>
                        <tbody className="divide-y divide-gray-100">
                            {mockAnnouncements.map((a) => (
                                <tr key={a.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-4 font-medium">{a.title}</td>
                                    <td className="px-4 py-4"><span className={clsx('px-2 py-1 rounded-full text-xs font-medium', a.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700')}>{a.priority.toUpperCase()}</span></td>
                                    <td className="px-4 py-4 text-gray-500">{a.createdAt}</td>
                                    <td className="px-4 py-4"><span className={clsx('px-2 py-1 rounded-full text-xs font-medium', a.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500')}>{a.active ? 'ACTIVE' : 'INACTIVE'}</span></td>
                                    <td className="px-4 py-4 flex gap-2"><button onClick={() => openEdit(a)} className="p-1 hover:bg-gray-100 rounded"><Edit size={16} /></button><button className="p-1 hover:bg-red-50 rounded text-red-600"><Trash2 size={16} /></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Schemes */}
            {activeTab === 'schemes' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mockSchemes.map((s) => (
                        <div key={s.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-semibold text-gray-800">{s.name}</h3>
                                    <span className="text-sm text-gray-500">{s.category}</span>
                                </div>
                                <span className={clsx('px-2 py-1 rounded-full text-xs font-medium', s.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500')}>{s.active ? 'ACTIVE' : 'INACTIVE'}</span>
                            </div>
                            <div className="text-sm space-y-2">
                                <p><span className="text-gray-500">Eligibility:</span> {s.eligibility}</p>
                                <p><span className="text-gray-500">Benefits:</span> {s.benefits}</p>
                            </div>
                            <div className="flex gap-2 mt-4"><button onClick={() => openEdit(s)} className="flex-1 px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-50 flex items-center justify-center gap-1"><Edit size={14} /> Edit</button></div>
                        </div>
                    ))}
                </div>
            )}

            {/* Officials */}
            {activeTab === 'officials' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50"><tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Name</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Designation</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Department</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Contact</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Actions</th>
                        </tr></thead>
                        <tbody className="divide-y divide-gray-100">
                            {mockOfficials.map((o) => (
                                <tr key={o.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-4 font-medium">{o.name}</td>
                                    <td className="px-4 py-4 text-gray-600">{o.designation}</td>
                                    <td className="px-4 py-4 text-gray-600">{o.department}</td>
                                    <td className="px-4 py-4 text-gray-500 text-sm">{o.contact}<br />{o.email}</td>
                                    <td className="px-4 py-4"><button onClick={() => openEdit(o)} className="p-1 hover:bg-gray-100 rounded"><Edit size={16} /></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold">{editItem ? 'Edit' : 'Add New'}</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div><label className="block text-sm font-medium mb-1">Title/Name</label><input type="text" defaultValue={editItem?.title || editItem?.name || ''} className="w-full px-3 py-2 border rounded-lg" /></div>
                            <div><label className="block text-sm font-medium mb-1">Content/Details</label><textarea rows={3} defaultValue={editItem?.content || editItem?.benefits || ''} className="w-full px-3 py-2 border rounded-lg" /></div>
                            <div className="flex gap-3"><button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 bg-gray-100 rounded-lg">Cancel</button><button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg flex items-center justify-center gap-2"><Save size={18} /> Save</button></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default ContentManagement;
