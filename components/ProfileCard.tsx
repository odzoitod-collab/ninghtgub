import React from 'react';
import { Link } from 'react-router-dom';
import { Profile } from '../types';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProfileCardProps {
  profile: Profile;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group relative block"
    >
      <Link to={`/profile/${profile.code}`} className="block">
        {/* Card Image Wrapper */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-neutral-900 shadow-2xl ring-1 ring-white/10 group-hover:ring-brand-accent/50 transition-all duration-500">
          <img 
            src={profile.photo_url || `https://picsum.photos/400/600?random=${profile.id}`} 
            alt={profile.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          
          {/* Subtle Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent opacity-80" />
          
          {/* Card Content */}
          <div className="absolute bottom-0 left-0 right-0 p-4 transform transition-transform duration-300">
            <div className="flex justify-between items-end mb-1">
              <h3 className="text-lg font-medium text-white flex items-center gap-2">
                {profile.name}
                <span className="text-xs font-normal text-neutral-400 bg-white/10 px-1.5 py-0.5 rounded">
                  {profile.age}
                </span>
              </h3>
            </div>
            
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-1 text-neutral-400 text-xs">
                  <MapPin size={12} className="text-brand-accent" />
                  <span>{profile.cities?.name || 'Москва'}</span>
               </div>
               <div className="text-brand-accent font-medium text-sm">
                 {parseInt(profile.price || '0').toLocaleString('ru-RU')} ₽
               </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProfileCard;