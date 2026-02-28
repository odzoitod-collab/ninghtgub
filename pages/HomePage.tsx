import React, { useEffect, useState } from 'react';
import { Filter, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { getProfiles, getCities } from '../services/supabase';
import { Profile, City } from '../types';
import ProfileCard from '../components/ProfileCard';
import Loader from '../components/Loader';

const HomePage: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCityId, setSelectedCityId] = useState<number | 'all'>('all');
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [profilesData, citiesData] = await Promise.all([
          getProfiles(),
          getCities()
        ]);
        setProfiles(profilesData);
        setCities(citiesData);
      } catch (error) {
        console.error("Failed to load initial data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProfiles = profiles.filter(p => {
    if (selectedCityId === 'all') return true;
    return p.city_id === selectedCityId;
  });

  return (
    <div className="min-h-screen pb-20 bg-brand-black">
      {/* Premium Hero */}
      <section className="relative pt-16 pb-12 px-4 overflow-hidden">
        <div className="absolute top-[-50%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-accent/5 blur-[120px] pointer-events-none rounded-full" />
        
        <div className="max-w-3xl mx-auto text-center relative z-10 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-extralight text-white mb-6 tracking-tight">
              Искусство <span className="text-brand-accent font-normal italic">наслаждения</span>
            </h1>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-brand-accent/50 to-transparent mx-auto mb-6"></div>
            <p className="text-neutral-500 text-sm md:text-base tracking-widest uppercase font-light max-w-lg mx-auto">
              Эксклюзивная платформа для идеальной компании
            </p>
          </motion.div>
        </div>
      </section>

      {/* City Filters */}
      <section className="max-w-7xl mx-auto px-4 mb-10">
        <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar mask-gradient-right">
           <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5 text-neutral-400 backdrop-blur-sm shrink-0">
             <Filter size={14} />
             <span className="text-[10px] font-medium uppercase tracking-widest">Город</span>
           </div>
           
           <button
             onClick={() => setSelectedCityId('all')}
             className={`px-5 py-2 rounded-full text-[10px] uppercase tracking-widest font-medium transition-all duration-300 whitespace-nowrap shrink-0 border ${
               selectedCityId === 'all' 
               ? 'bg-brand-accent border-brand-accent text-white shadow-[0_0_15px_rgba(139,92,246,0.35)]' 
               : 'bg-transparent text-neutral-400 border-white/10 hover:border-brand-accent/50 hover:text-white'
             }`}
           >
             Все города
           </button>

           {cities.map(city => (
             <button
               key={city.id}
               onClick={() => setSelectedCityId(city.id)}
               className={`px-5 py-2 rounded-full text-[10px] uppercase tracking-widest font-medium transition-all duration-300 whitespace-nowrap shrink-0 border ${
                 selectedCityId === city.id 
                 ? 'bg-brand-accent border-brand-accent text-white shadow-[0_0_15px_rgba(139,92,246,0.35)]' 
                 : 'bg-transparent text-neutral-400 border-white/10 hover:border-brand-accent/50 hover:text-white'
               }`}
             >
               {city.name}
             </button>
           ))}
        </div>
      </section>

      {/* Profile Grid */}
      <section className="max-w-7xl mx-auto px-4">
        {loading ? (
          <Loader />
        ) : filteredProfiles.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {filteredProfiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5">
            <MapPin className="w-10 h-10 text-neutral-600 mb-4 opacity-50" />
            <h3 className="text-lg font-light text-neutral-300">Анкеты не найдены</h3>
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;