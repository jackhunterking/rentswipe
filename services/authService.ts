import { supabase } from '../lib/supabase';
import { User } from '../types';

// Helper to map Supabase user to our app User type
const mapSupabaseUser = (u: any): User => {
  const metadata = u.user_metadata || {};
  return {
    id: u.id,
    name: metadata.full_name || u.email?.split('@')[0] || 'User',
    email: u.email || '',
    avatar: metadata.avatar_url || `https://i.pravatar.cc/150?u=${u.id}`,
    bio: metadata.bio || '',
    onboardingCompleted: metadata.onboarding_completed || false,
    preferences: metadata.preferences || {
      minPrice: 0,
      maxPrice: 10000,
      location: '',
      radius: 10,
      beds: 0,
      baths: 0,
      parkingOnly: false
    }
  };
};

export const loginUser = async (email: string, password: string): Promise<User> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  if (!data.user) throw new Error('No user returned');

  return mapSupabaseUser(data.user);
};

export const signUpUser = async (email: string, password: string, fullName: string): Promise<User> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        onboarding_completed: false,
      },
    },
  });

  if (error) throw error;
  if (!data.user) throw new Error('No user returned');

  return mapSupabaseUser(data.user);
};

export const logoutUser = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;
  return mapSupabaseUser(session.user);
};

export const updateUserPreferences = async (preferences: any): Promise<void> => {
  const { error } = await supabase.auth.updateUser({
    data: {
      preferences,
      onboarding_completed: true
    }
  });
  if (error) throw error;
};
