import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, DollarSign, Bed, Bath, Car, ArrowRight, Check } from 'lucide-react';
import { FilterState } from '../types';

interface OnboardingViewProps {
    onComplete: (preferences: FilterState) => void;
    initialName?: string;
}

const STEPS = [
    { id: 'welcome', title: 'Welcome' },
    { id: 'location', title: 'Where?' },
    { id: 'budget', title: 'Budget' },
    { id: 'essentials', title: 'Needs' },
];

const OnboardingView: React.FC<OnboardingViewProps> = ({ onComplete, initialName }) => {
    const [step, setStep] = useState(0);
    const [preferences, setPreferences] = useState<FilterState>({
        minPrice: 0,
        maxPrice: 3000,
        beds: 1,
        baths: 1,
        parkingOnly: false,
        location: '',
        radius: 10
    });

    const handleNext = () => {
        if (step < STEPS.length - 1) {
            setStep(prev => prev + 1);
        } else {
            onComplete(preferences);
        }
    };

    const updatePref = (key: keyof FilterState, value: any) => {
        setPreferences(prev => ({ ...prev, [key]: value }));
    };

    const renderStep = () => {
        switch (step) {
            case 0: // Welcome
                return (
                    <div className="flex flex-col items-center text-center space-y-6">
                        <div className="w-24 h-24 bg-brand-100 rounded-3xl flex items-center justify-center mb-4 text-brand-500 shadow-xl shadow-brand-500/10">
                            <span className="text-4xl">👋</span>
                        </div>
                        <h2 className="text-3xl font-bold text-zinc-900">
                            Hi {initialName || 'there'}!
                        </h2>
                        <p className="text-zinc-500 text-lg max-w-xs">
                            Let's find your next home. We just need to know what you're looking for.
                        </p>
                    </div>
                );

            case 1: // Location
                return (
                    <div className="space-y-6 w-full">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-zinc-900">Where do you want to live?</h2>
                            <p className="text-zinc-500">Pick a central location.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                                <input
                                    type="text"
                                    value={preferences.location}
                                    onChange={(e) => updatePref('location', e.target.value)}
                                    placeholder="City, Neighborhood, or Zip"
                                    className="w-full bg-white border-2 border-zinc-100 rounded-2xl py-4 pl-12 pr-4 text-lg font-medium focus:border-brand-500 focus:outline-none transition-colors"
                                    autoFocus
                                />
                            </div>

                            <div className="bg-white p-4 rounded-2xl border-2 border-zinc-100">
                                <div className="flex justify-between text-sm font-bold text-zinc-500 mb-4">
                                    <span>Search Radius</span>
                                    <span className="text-brand-500">{preferences.radius} km</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="50"
                                    value={preferences.radius}
                                    onChange={(e) => updatePref('radius', Number(e.target.value))}
                                    className="w-full h-2 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-brand-500"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 2: // Budget
                return (
                    <div className="space-y-6 w-full">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-zinc-900">What's your budget?</h2>
                            <p className="text-zinc-500">Monthly rent range.</p>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-3xl border-2 border-zinc-100 shadow-sm">
                                <div className="flex items-center justify-center gap-1 text-4xl font-bold text-zinc-900 mb-2">
                                    <span className="text-zinc-300 text-2xl">$</span>
                                    {preferences.maxPrice}
                                </div>
                                <p className="text-center text-zinc-400 text-sm font-bold uppercase tracking-wider">Max Price</p>
                            </div>

                            <input
                                type="range"
                                min="500"
                                max="10000"
                                step="100"
                                value={preferences.maxPrice}
                                onChange={(e) => updatePref('maxPrice', Number(e.target.value))}
                                className="w-full h-2 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-brand-500"
                            />
                        </div>
                    </div>
                );

            case 3: // Essentials
                return (
                    <div className="space-y-6 w-full">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-zinc-900">Must-haves?</h2>
                            <p className="text-zinc-500">Minimum requirements.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Beds */}
                            <div className="bg-white p-4 rounded-2xl border-2 border-zinc-100 flex flex-col items-center gap-3">
                                <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-500">
                                    <Bed size={20} />
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => updatePref('beds', Math.max(0, preferences.beds - 1))}
                                        className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center font-bold hover:bg-zinc-200"
                                    >-</button>
                                    <span className="text-xl font-bold">{preferences.beds}+</span>
                                    <button
                                        onClick={() => updatePref('beds', preferences.beds + 1)}
                                        className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center font-bold hover:bg-zinc-200"
                                    >+</button>
                                </div>
                                <span className="text-xs font-bold text-zinc-400 uppercase">Bedrooms</span>
                            </div>

                            {/* Baths */}
                            <div className="bg-white p-4 rounded-2xl border-2 border-zinc-100 flex flex-col items-center gap-3">
                                <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center text-zinc-500">
                                    <Bath size={20} />
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => updatePref('baths', Math.max(0, preferences.baths - 1))}
                                        className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center font-bold hover:bg-zinc-200"
                                    >-</button>
                                    <span className="text-xl font-bold">{preferences.baths}+</span>
                                    <button
                                        onClick={() => updatePref('baths', preferences.baths + 1)}
                                        className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center font-bold hover:bg-zinc-200"
                                    >+</button>
                                </div>
                                <span className="text-xs font-bold text-zinc-400 uppercase">Bathrooms</span>
                            </div>
                        </div>

                        <button
                            onClick={() => updatePref('parkingOnly', !preferences.parkingOnly)}
                            className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${preferences.parkingOnly ? 'border-brand-500 bg-brand-50' : 'border-zinc-100 bg-white'}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${preferences.parkingOnly ? 'bg-brand-100 text-brand-600' : 'bg-zinc-100 text-zinc-500'}`}>
                                    <Car size={20} />
                                </div>
                                <span className={`font-bold ${preferences.parkingOnly ? 'text-brand-900' : 'text-zinc-600'}`}>Parking Required</span>
                            </div>
                            {preferences.parkingOnly && <Check size={20} className="text-brand-500" />}
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className="fixed inset-0 bg-zinc-50 z-50 flex flex-col">
            {/* Progress Bar */}
            <div className="w-full h-1 bg-zinc-200">
                <motion.div
                    className="h-full bg-brand-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                />
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-md mx-auto w-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="w-full"
                    >
                        {renderStep()}
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="p-6 max-w-md mx-auto w-full">
                <button
                    onClick={handleNext}
                    disabled={step === 1 && !preferences.location} // Disable if location empty on step 1
                    className="w-full bg-zinc-900 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {step === STEPS.length - 1 ? 'Start Swiping' : 'Next'}
                    <ArrowRight size={20} />
                </button>
            </div>
        </div>
    );
};

export default OnboardingView;
