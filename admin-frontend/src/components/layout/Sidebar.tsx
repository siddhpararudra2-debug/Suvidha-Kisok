import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    ClipboardList,
    FileText,
    Users,
    Zap,
    Map as MapIcon,
    Monitor,
    BarChart3,
    Settings
} from 'lucide-react';
import clsx from 'clsx';

const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Complaints', path: '/complaints', icon: ClipboardList },
    { name: 'Applications', path: '/applications', icon: FileText },
    { name: 'Citizens', path: '/citizens', icon: Users },
    { name: 'Utility Data', path: '/utility-data', icon: Zap },
    { name: 'Infrastructure', path: '/infrastructure', icon: MapIcon },
    { name: 'Kiosks', path: '/kiosks', icon: Monitor },
    { name: 'Reports', path: '/reports', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
];

const Sidebar: React.FC = () => {
    const location = useLocation();

    return (
        <div className="w-64 bg-primary-900 text-white flex flex-col h-screen fixed left-0 top-0 overflow-y-auto">
            <div className="p-6 border-b border-primary-800">
                <h1 className="text-2xl font-bold tracking-wider">SUVIDHA</h1>
                <p className="text-sm text-primary-300">Admin Portal</p>
            </div>

            <nav className="flex-1 py-6">
                <ul className="space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={clsx(
                                        'flex items-center space-x-3 px-6 py-3 transition-colors',
                                        isActive
                                            ? 'bg-primary-800 text-white border-l-4 border-warning'
                                            : 'text-primary-200 hover:bg-primary-800 hover:text-white'
                                    )}
                                >
                                    <Icon size={20} />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="p-4 border-t border-primary-800">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary-700 flex items-center justify-center">
                        <span className="font-bold">A</span>
                    </div>
                    <div>
                        <p className="text-sm font-medium">Admin User</p>
                        <p className="text-xs text-primary-400">Online</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
