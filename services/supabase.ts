import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_KEY } from '../constants';
import { Profile, City, Order, Settings } from '../types';

// Ключи берутся из constants.ts, .env не используется
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// API Functions

export const getProfiles = async (): Promise<Profile[]> => {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      cities (
        name
      )
    `)
    .eq('is_available', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching profiles:', error);
    return [];
  }
  return data as Profile[] || [];
};

export const getCities = async (): Promise<City[]> => {
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .eq('is_active', true);
    
  if (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
  return data as City[] || [];
};

export const getProfileByCode = async (code: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      cities (
        name
      )
    `)
    .eq('code', code)
    .maybeSingle();

  if (error) {
    console.error('Error fetching profile by code:', error);
    return null;
  }
  return data as Profile;
};

export const createOrder = async (orderData: Partial<Order>) => {
  const { data, error } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single();

  if (error) {
    throw error;
  }
  return data;
};

export const getSettings = async (): Promise<Settings | null> => {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .maybeSingle();

  if (error) {
    console.error('Error fetching settings:', error);
    return null;
  }
  return data as Settings;
};
