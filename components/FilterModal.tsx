import React from 'react';
import { FilterState } from '../types';
import { X, MapPin, Car, Bed, Bath, Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onApply: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, filters, setFilters, onApply }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-md bg-white rounded-t-3xl shadow-2xl p-6 h-[85vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-zinc-900">Filters</h2>
          <button onClick={onClose} className="p-2 bg-zinc-100 rounded-full hover:bg-zinc-200 transition">
            <X size={20} className="text-zinc-600" />
          </button>
        </div>

        <div className="space-y-8">
          {/* Location */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
              <input
                type="text"
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                placeholder="City, Neighborhood, or Zip"
                className="w-full bg-zinc-50 text-zinc-900 border border-zinc-200 rounded-xl py-4 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm text-zinc-500 font-medium">
                <span>Search Radius</span>
                <span>{filters.radius} km</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={filters.radius}
                onChange={(e) => setFilters(prev => ({ ...prev, radius: Number(e.target.value) }))}
                className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-brand-500"
              />
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Price Range (Monthly)</label>
            <div className="flex gap-4">
              <div className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl p-3">
                <span className="text-xs text-zinc-400 block font-medium">Min</span>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, minPrice: Number(e.target.value) }))}
                  className="w-full bg-transparent text-zinc-900 font-bold focus:outline-none"
                />
              </div>
              <div className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl p-3">
                <span className="text-xs text-zinc-400 block font-medium">Max</span>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                  className="w-full bg-transparent text-zinc-900 font-bold focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Rooms */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Rooms</label>
            <div className="flex justify-between gap-4">
              {/* Bedrooms */}
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-zinc-500 font-medium">
                  <Bed size={16} /> <span className="text-sm">Bedrooms</span>
                </div>
                <div className="flex bg-zinc-100 rounded-xl p-1 border border-zinc-200">
                  {[0, 1, 2, 3].map(num => (
                    <button
                      key={`bed-${num}`}
                      onClick={() => setFilters(prev => ({ ...prev, beds: num }))}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${filters.beds === num ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400'}`}
                    >
                      {num === 0 ? 'Any' : `${num}+`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {/* Bathrooms */}
            <div className="flex-1 flex flex-col gap-2 mt-4">
              <div className="flex items-center gap-2 text-zinc-500 font-medium">
                <Bath size={16} /> <span className="text-sm">Bathrooms</span>
              </div>
              <div className="flex bg-zinc-100 rounded-xl p-1 border border-zinc-200">
                {[0, 1, 2].map(num => (
                  <button
                    key={`bath-${num}`}
                    onClick={() => setFilters(prev => ({ ...prev, baths: num }))}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${filters.baths === num ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-400'}`}
                  >
                    {num === 0 ? 'Any' : `${num}+`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Amenities</label>
            <button
              onClick={() => setFilters(prev => ({ ...prev, parkingOnly: !prev.parkingOnly }))}
              className={`w-full flex items-center justify-between p-4 rounded-xl border transition ${filters.parkingOnly ? 'bg-brand-50 border-brand-200' : 'bg-zinc-50 border-zinc-200'}`}
            >
              <div className="flex items-center gap-3">
                <Car className={filters.parkingOnly ? 'text-brand-500' : 'text-zinc-400'} size={20} />
                <span className={filters.parkingOnly ? 'text-zinc-900 font-medium' : 'text-zinc-500'}>Parking Included</span>
              </div>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${filters.parkingOnly ? 'bg-brand-500 border-brand-500' : 'border-zinc-300'}`}>
                {filters.parkingOnly && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
            </button>
          </div>
        </div>

        <div className="sticky bottom-0 pt-6 mt-8 pb-4 bg-white">
          <button
            onClick={onApply}
            className="w-full bg-brand-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-brand-500/20 active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            <Search size={20} />
            Show Results
          </button>
        </div>

      </motion.div>
    </motion.div>
  );
};

export default FilterModal;