import React from 'react';
import { Bell, User } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../redux/store';
import { logout } from '../../redux/slices/authSlice';

const Header: React.FC = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm ml-64">
            <div className="text-gray-500 text-sm">
                Welcome back, <span className="font-semibold text-gray-800">{user?.name}</span>
            </div>

            <div className="flex items-center space-x-6">
                <button className="relative p-2 text-gray-500 hover:text-primary-600 transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <div className="flex items-center space-x-3 cursor-pointer group" onClick={handleLogout}>
                    <div className="text-right">
                        <p className="text-sm font-medium text-gray-800 group-hover:text-primary-600">{user?.designation}</p>
                        <p className="text-xs text-gray-500">{user?.employee_id}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                        <User size={20} />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
