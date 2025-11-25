import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Rental } from '../types';
import { MapPin, Bed, Bath, Car, Check, ShieldCheck, MessageCircle, Phone, ChevronDown } from 'lucide-react';

interface RentalDetailViewProps {
    rental: Rental;
    onClose: () => void;
}

const RentalDetailView: React.FC<RentalDetailViewProps> = ({ rental, onClose }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (scrollRef.current) {
            const index = Math.round(scrollRef.current.scrollLeft / scrollRef.current.clientWidth);
            setCurrentImageIndex(index);
        }
    };

    return (
        <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 bg-black flex flex-col"
        >
            {/* Image Carousel - Height optimized for visual experience (approx 65% of screen) */}
            <div className="relative h-[65%] w-full bg-zinc-900 shrink-0">
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="w-full h-full flex overflow-x-auto snap-x snap-mandatory no-scrollbar touch-pan-x"
                >
                    {rental.images.map((img, i) => (
                        <img
                            key={i}
                            src={img}
                            alt={`View ${i + 1}`}
                            className="w-full h-full object-cover shrink-0 snap-center"
                        />
                    ))}
                </div>

                {/* Gradient Overlay for Top UI visibility */}
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />

                {/* Pagination Dots */}
                <div className="absolute bottom-12 left-0 w-full flex justify-center gap-1.5 z-20 pointer-events-none">
                    {rental.images.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all shadow-sm backdrop-blur-md ${i === currentImageIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`}
                        />
                    ))}
                </div>

                {/* Close Button (Floating Top Left) */}
                <button
                    onClick={onClose}
                    className="absolute top-safe top-4 left-4 p-2 bg-black/20 backdrop-blur-md rounded-full text-white z-30 hover:bg-black/30 transition active:scale-95"
                >
                    <ChevronDown size={24} />
                </button>
            </div>

            {/* Bottom Sheet - Details & Actions */}
            <div className="flex-1 bg-white relative -mt-6 rounded-t-3xl z-10 flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
                {/* Drag Handle */}
                <div
                    className="w-full flex justify-center pt-4 pb-2 bg-white rounded-t-3xl shrink-0 cursor-grab active:cursor-grabbing"
                    onClick={onClose}
                >
                    <div className="w-12 h-1.5 bg-zinc-200 rounded-full" />
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-6 pb-28">
                    <div className="mt-1 mb-6">
                        <h1 className="text-2xl font-extrabold text-zinc-900 flex items-baseline gap-1">
                            {rental.currency}{rental.price.toLocaleString()}
                            <span className="text-sm font-medium text-zinc-500">/mo</span>
                        </h1>
                        <div className="flex items-center gap-1 text-zinc-500 mt-1 font-medium">
                            <MapPin size={14} className="text-brand-500" />
                            <span className="text-sm truncate">{rental.address}, {rental.city}</span>
                        </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        <div className="bg-zinc-50 rounded-2xl p-3 flex flex-col items-center justify-center border border-zinc-100">
                            <Bed className="mb-1 text-brand-500" size={20} />
                            <span className="font-bold text-base text-zinc-900">{rental.bedrooms}</span>
                            <span className="text-[10px] text-zinc-500 font-bold uppercase">Beds</span>
                        </div>
                        <div className="bg-zinc-50 rounded-2xl p-3 flex flex-col items-center justify-center border border-zinc-100">
                            <Bath className="mb-1 text-brand-500" size={20} />
                            <span className="font-bold text-base text-zinc-900">{rental.bathrooms}</span>
                            <span className="text-[10px] text-zinc-500 font-bold uppercase">Baths</span>
                        </div>
                        <div className="bg-zinc-50 rounded-2xl p-3 flex flex-col items-center justify-center border border-zinc-100">
                            <Car className="mb-1 text-brand-500" size={20} />
                            <span className="font-bold text-base text-zinc-900">{rental.parking ? 'Yes' : 'No'}</span>
                            <span className="text-[10px] text-zinc-500 font-bold uppercase">Parking</span>
                        </div>
                    </div>

                    {/* Amenities Preview */}
                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-zinc-900 mb-3 uppercase tracking-wider">Highlights</h3>
                        <div className="flex flex-wrap gap-2">
                            {rental.amenities.slice(0, 4).map((item, i) => (
                                <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 rounded-lg border border-zinc-100 text-xs font-semibold text-zinc-600">
                                    <Check size={10} className="text-brand-500" strokeWidth={3} />
                                    {item}
                                </div>
                            ))}
                            {rental.amenities.length > 4 && (
                                <div className="px-3 py-1.5 bg-zinc-50 rounded-lg border border-zinc-100 text-xs font-semibold text-zinc-400">
                                    +{rental.amenities.length - 4} more
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Owner Section */}
                    {rental.owner && (
                        <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-4 flex items-center gap-3">
                            <img src={rental.owner.avatar} alt="Agent" className="w-12 h-12 rounded-full object-cover border border-white shadow-sm" />
                            <div className="flex-1">
                                <div className="flex items-center gap-1">
                                    <span className="font-bold text-zinc-900 text-sm">{rental.owner.name}</span>
                                    {rental.owner.verified && <ShieldCheck size={14} className="text-brand-500" fill="currentColor" />}
                                </div>
                                <span className="text-xs text-zinc-500 font-medium uppercase">Listing Agent</span>
                            </div>
                            <button className="bg-white p-2 rounded-full border border-zinc-200 text-zinc-600 shadow-sm">
                                <MessageCircle size={18} />
                            </button>
                            <button className="bg-zinc-900 p-2 rounded-full text-white shadow-md">
                                <Phone size={18} />
                            </button>
                        </div>
                    )}

                    <div className="h-4" /> {/* Spacer */}
                </div>

                {/* Bottom Action Button */}
                <div className="absolute bottom-0 left-0 w-full p-4 bg-white border-t border-zinc-100 safe-area-bottom">
                    <button className="w-full bg-brand-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-brand-500/20 active:scale-95 transition-transform flex items-center justify-center gap-2">
                        Apply Now
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default RentalDetailView;