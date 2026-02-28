export interface City {
  id: number;
  name: string;
  is_active: boolean;
}

export interface Profile {
  id: number;
  code: string;
  worker_id: number;
  name: string;
  age: number;
  weight: number;
  height: number;
  breast_size: string;
  city_id: number;
  cities?: {
    name: string;
  };
  price: string; // Base price stored as string or number in DB, using string based on prompt
  description: string;
  photo_url: string;
  photo_urls: string[];
  is_available: boolean;
  created_at: string;
}

export interface Order {
  id?: number;
  client_tg_id: number;
  profile_id: number;
  duration: '1h' | '2h' | 'night';
  base_price: number;
  final_price: number;
  promo_code?: string;
  promo_discount?: number;
  status: 'pending' | 'paid' | 'completed' | 'cancelled';
  created_at?: string;
}

export interface Settings {
  id: number;
  support_username: string;
  payment_details: string;
}
