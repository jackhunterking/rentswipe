import React from 'react';
import { User, Layers, Heart } from 'lucide-react';
import { TabView } from '../types';

interface BottomNavProps {
    currentTab: TabView;
    onTabChange: (tab: TabView) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
    return (
        <div className="w-full bg-white border-t border-zinc-100 z-40 pb-safe pt-2 px-6 h-[80px]">
            <div className="flex justify-between items-center h-full max-w-sm mx-auto">
                {/* Profile (Left) */}
                <button
                    onClick={() => onTabChange('profile')}
                    className={`flex flex-col items-center justify-center w-12 h-12 transition-colors ${currentTab === 'profile' ? 'text-zinc-900' : 'text-zinc-400'}`}
                >
                    <User size={26} strokeWidth={currentTab === 'profile' ? 2.5 : 2} />
                </button>

                {/* Swipe / Discover (Center) */}
                <button
                    onClick={() => onTabChange('discover')}
                    className={`flex flex-col items-center justify-center w-12 h-12 transition-colors ${currentTab === 'discover' ? 'text-brand-500' : 'text-zinc-300'}`}
                >
                    <div className="relative">
                        <Layers size={30} strokeWidth={currentTab === 'discover' ? 2.5 : 2} fill={currentTab === 'discover' ? "currentColor" : "none"} className={currentTab === 'discover' ? 'text-brand-500' : 'text-zinc-300'} />
                        {currentTab === 'discover' && (
                            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-500 rounded-full" />
                        )}
                    </div>
                </button>

                {/* Favorites (Right) */}
                <button
                    onClick={() => onTabChange('favorites')}
                    className={`flex flex-col items-center justify-center w-12 h-12 transition-colors ${currentTab === 'favorites' ? 'text-zinc-900' : 'text-zinc-400'}`}
                >
                    <Heart size={26} strokeWidth={currentTab === 'favorites' ? 2.5 : 2} fill={currentTab === 'favorites' ? "currentColor" : "none"} />
                </button>
            </div>
        </div>
    );
};

export default BottomNav;