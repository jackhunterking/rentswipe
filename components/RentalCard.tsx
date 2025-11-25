import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Rental, SwipeDirection } from '../types';
import { Bed, Bath, Car, MapPin, Share2, Info, Check, X } from 'lucide-react';

interface RentalCardProps {
  rental: Rental;
  onSwipe: (direction: SwipeDirection) => void;
  isFront: boolean;
  onDetailsClick: () => void;
}

const RentalCard: React.FC<RentalCardProps> = ({ rental, onSwipe, isFront, onDetailsClick }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Framer Motion Values
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-8, 8]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  // Overlay Opacities
  const likeOpacity = useTransform(x, [20, 150], [0, 1]);
  const nopeOpacity = useTransform(x, [-20, -150], [0, 1]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      onSwipe(SwipeDirection.RIGHT);
    } else if (info.offset.x < -threshold) {
      onSwipe(SwipeDirection.LEFT);
    }
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentImageIndex < rental.images.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
  };

  return (
    <motion.div
      style={{
        x,
        rotate,
        zIndex: isFront ? 10 : 0
      }}
      drag={isFront ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      dragElastic={0.7}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing ${isFront ? '' : 'pointer-events-none'}`}
    >
      <div className={`relative w-full h-full rounded-3xl overflow-hidden shadow-xl bg-white select-none`}>
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full bg-zinc-200">
          <img
            src={rental.images[currentImageIndex]}
            alt="Rental"
            className="w-full h-full object-cover pointer-events-none"
            draggable={false}
          />

          {/* Top Gradient for visibility if needed */}
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-black/30 to-transparent pointer-events-none" />

          {/* Bottom Gradient for Text */}
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
        </div>

        {/* Tappable Navigation Areas */}
        <div className="absolute inset-y-0 left-0 w-1/4 z-20" onClick={prevImage} />
        <div className="absolute inset-y-0 right-0 w-1/4 z-20" onClick={nextImage} />
        <div className="absolute top-24 bottom-32 left-1/4 right-1/4 z-10" onClick={onDetailsClick} />

        {/* Pagination Indicators */}
        <div className="absolute top-4 left-0 w-full flex justify-center gap-1.5 px-4 z-20">
          {rental.images.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 rounded-full transition-all duration-300 shadow-sm backdrop-blur-md ${idx === currentImageIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50'}`}
            />
          ))}
        </div>

        {/* Swipe Feedback Overlays */}
        <motion.div style={{ opacity: likeOpacity }} className="absolute top-12 left-8 z-30 pointer-events-none">
          <div className="border-[4px] border-green-400 rounded-lg px-4 py-1 -rotate-12 bg-black/20 backdrop-blur-sm">
            <span className="text-4xl font-black text-green-400 uppercase tracking-widest">Like</span>
          </div>
        </motion.div>

        <motion.div style={{ opacity: nopeOpacity }} className="absolute top-12 right-8 z-30 pointer-events-none">
          <div className="border-[4px] border-red-500 rounded-lg px-4 py-1 rotate-12 bg-black/20 backdrop-blur-sm">
            <span className="text-4xl font-black text-red-500 uppercase tracking-widest">Nope</span>
          </div>
        </motion.div>

        {/* Information Overlay */}
        <div
          className="absolute bottom-0 left-0 w-full p-5 z-30"
          onClick={(e) => { e.stopPropagation(); onDetailsClick(); }}
        >
          <div className="flex flex-col gap-1 mb-2">
            {/* Location Badge */}
            <div className="self-start inline-flex items-center gap-1 bg-brand-500 text-white px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider mb-1">
              <MapPin size={10} />
              {rental.city}
            </div>

            <h2 className="text-2xl font-bold text-white leading-tight drop-shadow-md pr-16">
              {rental.address}
            </h2>
          </div>

          <div className="flex items-end justify-between mt-2">
            {/* Left: Amenities Icons */}
            <div className="flex items-center gap-3 text-white/90">
              <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2 py-1.5 rounded-lg border border-white/10">
                <Bed size={16} />
                <span className="text-sm font-bold">{rental.bedrooms}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2 py-1.5 rounded-lg border border-white/10">
                <Bath size={16} />
                <span className="text-sm font-bold">{rental.bathrooms}</span>
              </div>
              {rental.parking && (
                <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2 py-1.5 rounded-lg border border-white/10">
                  <Car size={16} />
                </div>
              )}
            </div>

            {/* Right Bottom: Price */}
            <div className="flex flex-col items-end">
              <span className="text-3xl font-bold text-white drop-shadow-md tracking-tight">
                {rental.currency}{rental.price}
              </span>
              <span className="text-xs text-white/80 font-medium uppercase tracking-wide">/ Month</span>
            </div>
          </div>

          <button className="absolute -top-6 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition">
            <Info size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default RentalCard;