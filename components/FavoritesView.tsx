import React from 'react';
import { Rental } from '../types';
import { MapPin, Bed, Bath, Share2, Heart } from 'lucide-react';

interface FavoritesViewProps {
    favorites: Rental[];
    onRentalClick: (rental: Rental) => void;
}

const FavoritesView: React.FC<FavoritesViewProps> = ({ favorites, onRentalClick }) => {

    const handleShare = async (e: React.MouseEvent, rental: Rental) => {
        e.stopPropagation();

        // Construct a dummy URL for sharing since we don't have real routing
        const shareUrl = `https://rentswipe.app/rentals/${rental.id}`;
        const shareData = {
            title: `Apartment for rent in ${rental.city}`,
            text: `Check out this ${rental.bedrooms} bed, ${rental.bathrooms} bath rental for ${rental.currency}${rental.price} on RentSwipe!`,
            url: shareUrl,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Fallback for browsers that don't support Web Share API
                await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
                alert("Link copied to clipboard!");
            }
        } catch (error) {
            if ((error as Error).name !== 'AbortError') {
                console.error('Error sharing:', error);
            }
        }
    };

    return (
        <div className="h-full bg-zinc-50 p-6 overflow-y-auto pb-32">
            <div className="flex items-center gap-2 mb-6">
                <Heart className="text-brand-500" fill="currentColor" size={28} />
                <h1 className="text-3xl font-extrabold text-zinc-900">Your Favorites</h1>
            </div>

            {favorites.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 opacity-60">
                    <div className="w-20 h-20 bg-zinc-200 rounded-full mb-4 flex items-center justify-center">
                        <Heart size={32} className="text-zinc-400" />
                    </div>
                    <p className="text-zinc-500 font-medium">No favorites yet.</p>
                    <p className="text-zinc-400 text-sm mt-2">Swipe right to save homes you like.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {favorites.map(rental => (
                        <div
                            key={rental.id}
                            onClick={() => onRentalClick(rental)}
                            className="bg-white rounded-2xl overflow-hidden flex h-28 shadow-sm border border-zinc-100 active:scale-[0.98] transition-transform cursor-pointer"
                        >
                            <img src={rental.images[0]} alt="Rental" className="w-28 h-full object-cover bg-zinc-200" />
                            <div className="p-3 flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="font-bold text-zinc-900 text-lg">{rental.currency}{rental.price}/mo</h3>
                                    <div className="flex items-center gap-1 text-zinc-500 text-xs mt-1 font-medium">
                                        <MapPin size={12} className="text-brand-500" />
                                        <span className="truncate">{rental.city}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                    <div className="flex gap-3 text-xs text-zinc-400 font-medium">
                                        <span className="flex items-center gap-1"><Bed size={14} /> {rental.bedrooms}</span>
                                        <span className="flex items-center gap-1"><Bath size={14} /> {rental.bathrooms}</span>
                                    </div>
                                    <button
                                        onClick={(e) => handleShare(e, rental)}
                                        className="p-2 bg-zinc-50 rounded-full text-zinc-400 hover:text-brand-500 hover:bg-brand-50 transition border border-zinc-100"
                                    >
                                        <Share2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FavoritesView;