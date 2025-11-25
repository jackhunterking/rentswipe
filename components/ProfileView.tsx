import React, { useState } from 'react';
import { User as UserType } from '../types';
import { loginUser, logoutUser } from '../services/authService';
import { Settings, LogOut, Loader2, UserCircle, Edit2 } from 'lucide-react';

interface ProfileViewProps {
    user: UserType | null;
    setUser: (user: UserType | null) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, setUser }) => {
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try {
            const userData = await loginUser();
            setUser(userData);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logoutUser();
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-zinc-50">
                <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-zinc-100">
                    <UserCircle size={64} className="text-zinc-300" />
                </div>
                <h2 className="text-2xl font-bold mb-3 text-zinc-900">Create Profile</h2>
                <p className="text-zinc-500 mb-8 max-w-xs mx-auto">Log in to save your favorite rentals, contact agents, and apply instantly.</p>
                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full bg-brand-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-500/20 active:scale-95 transition flex justify-center"
                >
                    {loading ? <Loader2 className="animate-spin" /> : 'Sign In with Phone'}
                </button>
            </div>
        );
    }

    return (
        <div className="h-full bg-zinc-50 p-6 overflow-y-auto pb-32">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-extrabold text-zinc-900">Profile</h1>
                <button className="p-2 bg-white rounded-full text-zinc-400 hover:text-zinc-900 shadow-sm border border-zinc-100">
                    <Settings size={20} />
                </button>
            </div>

            <div className="flex flex-col items-center mb-10">
                <div className="relative group">
                    <img src={user.avatar} alt="Profile" className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover" />
                    <button className="absolute bottom-1 right-1 p-2 bg-zinc-900 text-white rounded-full border-2 border-white shadow-lg">
                        <Edit2 size={14} />
                    </button>
                </div>
                <h2 className="text-2xl font-bold mt-4 text-zinc-900">{user.name}</h2>
                <p className="text-zinc-500 font-medium">{user.email}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Search Preferences</h3>
                    <button className="text-brand-500 text-sm font-bold">Edit</button>
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-zinc-50 pb-4">
                        <span className="text-zinc-600 font-medium">Monthly Budget</span>
                        <span className="font-bold text-zinc-900">${user.preferences?.minPrice} - ${user.preferences?.maxPrice}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-zinc-600 font-medium">Desired Location</span>
                        <span className="font-bold text-zinc-900">{user.preferences?.location}</span>
                    </div>
                </div>
            </div>

            <button
                onClick={handleLogout}
                className="w-full bg-white text-red-500 font-bold py-4 rounded-xl border border-zinc-200 active:scale-95 transition flex items-center justify-center gap-2 hover:bg-red-50 hover:border-red-100"
            >
                <LogOut size={18} />
                Sign Out
            </button>
        </div>
    );
};

export default ProfileView;