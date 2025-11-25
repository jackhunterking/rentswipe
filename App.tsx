import React, { useState, useEffect } from 'react';
import { FilterState, Rental, SwipeDirection, User, TabView } from './types';
import { fetchRentals, addToFavorites } from './services/rentalService';
import RentalCard from './components/RentalCard';
import FilterModal from './components/FilterModal';
import BottomNav from './components/BottomNav';
import ProfileView from './components/ProfileView';
import FavoritesView from './components/FavoritesView';
import RentalDetailView from './components/RentalDetailView';
import OnboardingView from './components/OnboardingView';
import { SlidersHorizontal, RefreshCw, Loader2, Home } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

const INITIAL_FILTERS: FilterState = {
  minPrice: 0,
  maxPrice: 5000,
  beds: 0,
  baths: 0,
  parkingOnly: false,
  location: '',
  radius: 10
};

const App: React.FC = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [favorites, setFavorites] = useState<Rental[]>([]);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [swipedIds, setSwipedIds] = useState<Set<string>>(new Set());

  // Navigation State
  const [currentTab, setCurrentTab] = useState<TabView>('discover');
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(true);

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Main fetch effect
  useEffect(() => {
    // Check local storage for onboarding status
    const onboarded = localStorage.getItem('rentswipe_onboarded');
    if (onboarded === 'true') {
      setShowOnboarding(false);
      const savedFilters = localStorage.getItem('rentswipe_filters');
      if (savedFilters) {
        setFilters(JSON.parse(savedFilters));
      }
      loadRentals(0, savedFilters ? JSON.parse(savedFilters) : filters);
    } else {
      setLoading(false); // Stop loading to show onboarding
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadRentals = async (pageNum: number, currentFilters = filters) => {
    if (pageNum === 0) setLoading(true);
    try {
      const data = await fetchRentals(currentFilters, pageNum);
      const freshData = data.filter(r => !swipedIds.has(r.id));

      if (data.length === 0) setHasMore(false);

      setRentals(prev => pageNum === 0 ? freshData : [...prev, ...freshData]);
      setPage(pageNum);
    } catch (error) {
      console.error("Failed to fetch rentals", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingComplete = (prefs: FilterState) => {
    setFilters(prefs);
    localStorage.setItem('rentswipe_filters', JSON.stringify(prefs));
    localStorage.setItem('rentswipe_onboarded', 'true');
    setShowOnboarding(false);
    loadRentals(0, prefs);
  };

  const handleApplyFilters = () => {
    setIsFilterOpen(false);
    setSwipedIds(new Set());
    localStorage.setItem('rentswipe_filters', JSON.stringify(filters));
    setHasMore(true);
    loadRentals(0);
  };

  const handleSwipe = (direction: SwipeDirection, rental: Rental) => {
    setSwipedIds(prev => new Set(prev).add(rental.id));
    setRentals(prev => {
      const newRentals = prev.filter(r => r.id !== rental.id);
      // Fetch more if running low
      if (newRentals.length < 3 && hasMore) {
        loadRentals(page + 1);
      }
      return newRentals;
    });

    if (direction === SwipeDirection.RIGHT) {
      setFavorites(prev => [...prev, rental]);
      if (user) {
        addToFavorites(user.id, rental.id).catch(console.error);
      }
    }
  };

  // View Renders
  const renderDiscover = () => (
    <div className="relative w-full h-full flex flex-col">
      {/* Main Card Stack Container */}
      <div className="flex-1 relative w-full max-w-md mx-auto h-full p-3 pb-4">
        {loading && page === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-400 gap-4">
            <Loader2 size={40} className="animate-spin text-brand-500" />
            <p className="font-medium">Finding homes nearby...</p>
          </div>
        ) : rentals.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <div className="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center mb-6 text-brand-500">
              <RefreshCw size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-zinc-800">You're all caught up!</h3>
            <p className="text-zinc-500 mb-8">Change your filters to see more results.</p>
            <button
              onClick={() => setIsFilterOpen(true)}
              className="bg-zinc-900 text-white font-bold px-8 py-3 rounded-full shadow-lg hover:bg-zinc-800 transition mb-4"
            >
              Adjust Filters
            </button>
            <button
              onClick={() => { setSwipedIds(new Set()); setHasMore(true); loadRentals(0); }}
              className="text-sm text-zinc-500 hover:text-zinc-800 font-medium flex items-center gap-2"
            >
              Review Again
            </button>
          </div>
        ) : (
          <div className="relative w-full h-full">
            <AnimatePresence>
              {rentals.map((rental, index) => {
                // Only render the top few cards for performance
                if (index > 2) return null;
                const isFront = index === 0;
                return (
                  <RentalCard
                    key={rental.id}
                    rental={rental}
                    isFront={isFront}
                    onSwipe={(dir) => handleSwipe(dir, rental)}
                    onDetailsClick={() => setSelectedRental(rental)}
                  />
                );
              }).reverse()}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );

  if (showOnboarding) {
    return <OnboardingView onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="relative w-full h-[100dvh] bg-white text-zinc-900 overflow-hidden font-sans flex flex-col">

      {/* Top Header - Bumble Style */}
      <header className="px-4 py-3 flex justify-between items-center bg-white border-b border-zinc-100 z-50 sticky top-0 h-16 shadow-sm/50">
        {/* Logo Mark */}
        <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20 active:scale-95 transition-transform">
          <Home size={20} className="text-white" strokeWidth={3} />
        </div>

        {/* Text Logo */}
        <h1 className="text-2xl font-bold text-brand-500 tracking-tight">bumble<span className="text-brand-500/80">rent</span></h1>

        {/* Filter Button */}
        <button
          onClick={() => setIsFilterOpen(true)}
          className="p-2 -mr-2 text-zinc-400 hover:text-zinc-600 active:scale-95 transition-transform"
        >
          <SlidersHorizontal size={24} />
        </button>
      </header>

      {/* View Router */}
      <main className="flex-1 overflow-hidden relative bg-zinc-50">
        {currentTab === 'discover' && renderDiscover()}
        {currentTab === 'favorites' && (
          <FavoritesView
            favorites={favorites}
            onRentalClick={setSelectedRental}
          />
        )}
        {currentTab === 'profile' && <ProfileView user={user} setUser={setUser} />}
      </main>

      {/* Bottom Navigation */}
      <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />

      {/* Modals */}
      <AnimatePresence>
        {isFilterOpen && (
          <FilterModal
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            filters={filters}
            setFilters={setFilters}
            onApply={handleApplyFilters}
          />
        )}
        {selectedRental && (
          <RentalDetailView
            rental={selectedRental}
            onClose={() => setSelectedRental(null)}
          />
        )}
      </AnimatePresence>

    </div>
  );
};

export default App;