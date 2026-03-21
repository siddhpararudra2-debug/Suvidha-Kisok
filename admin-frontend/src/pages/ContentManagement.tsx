import React, { useState } from 'react';
import { Megaphone, Book, Users, Plus, Edit, Trash2, X, Save } from 'lucide-react';
import clsx from 'clsx';
import api from '../utils/api';

type Tab = 'announcements' | 'schemes' | 'officials';

interface Announcement {
    id: string;
    title: string;
    type: string;
    status: string;
    author: string;
    content: string;
    createdAt: string;
}

interface Scheme {
    id: string; title: string; category: string; eligibility: string; benefits: string; status: string; description: string;
}

interface Official {
    id: string; name: string; designation: string; department: string; contact: string; email: string; status: string;
}



const ContentManagement: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('announcements');
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState<any>(null);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [schemes, setSchemes] = useState<Scheme[]>([]);
    const [officials, setOfficials] = useState<Official[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchData = React.useCallback(async () => {
        setLoading(true);
        try {
            const [schemesRes, officialsRes, announcementsRes] = await Promise.all([
                api.get('/admin/schemes'),
                api.get('/admin/officials'),
                api.get('/admin/content')
            ]);
            setSchemes(schemesRes.data);
            setOfficials(officialsRes.data);
            setAnnouncements(announcementsRes.data);
        } catch (error) {
            console.error('Failed to fetch content:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

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
                            {announcements.map((a) => (
                                <tr key={a.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-4">
                                        <p className="font-medium">{a.title}</p>
                                        <p className="text-xs text-gray-500 truncate max-w-xs">{a.content}</p>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                            {a.type.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-gray-500">
                                        {new Date(a.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={clsx(
                                            'px-2 py-1 rounded-full text-xs font-medium',
                                            a.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                        )}>
                                            {a.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 flex gap-2">
                                        <button onClick={() => openEdit(a)} className="p-1 hover:bg-gray-100 rounded">
                                            <Edit size={16} />
                                        </button>
                                        <button className="p-1 hover:bg-red-50 rounded text-red-600">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Schemes */}
            {activeTab === 'schemes' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {loading ? (
                        <div className="col-span-2 text-center py-10 text-gray-500">Loading schemes...</div>
                    ) : (
                        schemes.map((s) => (
                            <div key={s.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{s.title}</h3>
                                        <span className="text-sm text-gray-500">{s.category}</span>
                                    </div>
                                    <span className={clsx('px-2 py-1 rounded-full text-xs font-medium', s.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500')}>{s.status}</span>
                                </div>
                                <div className="text-sm space-y-2">
                                    <p><span className="text-gray-500">Eligibility:</span> {s.eligibility}</p>
                                    <p><span className="text-gray-500">Benefits:</span> {s.benefits}</p>
                                </div>
                                <div className="flex gap-2 mt-4"><button onClick={() => openEdit(s)} className="flex-1 px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-50 flex items-center justify-center gap-1"><Edit size={14} /> Edit</button></div>
                            </div>
                        ))
                    )}
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
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase">Actions</th>
                        </tr></thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={5} className="text-center py-10 text-gray-500">Loading officials...</td></tr>
                            ) : (
                                officials.map((o) => (
                                    <tr key={o.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-4 font-medium">{o.name}</td>
                                        <td className="px-4 py-4 text-gray-600">{o.designation}</td>
                                        <td className="px-4 py-4 text-gray-600">{o.department}</td>
                                        <td className="px-4 py-4">
                                            <span className={clsx('px-2 py-1 rounded-full text-xs font-medium', o.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700')}>
                                                {o.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4"><button onClick={() => openEdit(o)} className="p-1 hover:bg-gray-100 rounded"><Edit size={16} /></button></td>
                                    </tr>
                                ))
                            )}
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
