import { supabase } from '../lib/supabase';
import { Rental, FilterState } from '../types';

export const fetchRentals = async (filters: FilterState, page = 0, limit = 10): Promise<Rental[]> => {
  let query = supabase
    .from('rentals')
    .select('*')
    .range(page * limit, (page + 1) * limit - 1);

  if (filters.minPrice > 0) query = query.gte('price', filters.minPrice);
  if (filters.maxPrice < 10000) query = query.lte('price', filters.maxPrice);
  if (filters.beds > 0) query = query.gte('bedrooms', filters.beds);
  if (filters.baths > 0) query = query.gte('bathrooms', filters.baths);
  if (filters.parkingOnly) query = query.eq('parking', true);

  if (filters.location && filters.location.trim() !== '') {
    // Simple text search for now. For radius, we'd need PostGIS or a custom RPC.
    query = query.ilike('city', `%${filters.location}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching rentals:', error);
    throw error;
  }

  return (data || []).map((r: any) => ({
    id: r.id,
    images: r.images || [],
    price: r.price,
    currency: r.currency || '$',
    address: r.address,
    city: r.city,
    bedrooms: r.bedrooms,
    bathrooms: r.bathrooms,
    parking: r.parking,
    sqft: r.sqft,
    description: r.description,
    amenities: r.amenities || [],
    isFavorite: false,
    owner: r.owner || {
      name: "Host",
      avatar: "",
      verified: false
    }
  }));
};

export const addToFavorites = async (userId: string, rentalId: string): Promise<void> => {
  const { error } = await supabase
    .from('favorites')
    .insert({ user_id: userId, rental_id: rentalId });

  if (error) {
    // Ignore duplicate key error (already favorited)
    if (error.code === '23505') return;
    throw error;
  }
};
