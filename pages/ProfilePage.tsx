import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Ruler, Weight, Info, Clock, ShieldCheck, Star, Copy, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProfileByCode, getSettings } from '../services/supabase';
import { Profile } from '../types';
import { calculatePrice, formatPrice } from '../utils/formatters';
import Gallery from '../components/Gallery';
import Loader from '../components/Loader';

const ProfilePage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Order State
  const [duration, setDuration] = useState<'1h' | '2h' | 'night'>('1h');
  const [bookingStep, setBookingStep] = useState<'select' | 'payment'>('select');
  const [promoCode, setPromoCode] = useState('');
  const [paymentDetails, setPaymentDetails] = useState('');

  useEffect(() => {
    if (!code) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const [profileData, settingsData] = await Promise.all([
          getProfileByCode(code),
          getSettings()
        ]);
        
        if (profileData) {
          setProfile(profileData);
        } else {
          setError('Анкета не найдена');
        }

        if (settingsData?.payment_details) {
          setPaymentDetails(settingsData.payment_details);
        } else {
          // Fallback if settings are empty or table missing
          setPaymentDetails("Свяжитесь с поддержкой для получения реквизитов");
        }
      } catch (err) {
        setError('Ошибка загрузки');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [code]);

  const handleBooking = () => {
    if (!profile) return;
    setBookingStep('payment');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast here, but simple alert or visual feedback is fine for now
    // For this minimal setup, we just rely on user action
  };

  if (loading) return <Loader />;

  if (error || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-brand-black">
        <h2 className="text-2xl font-light text-brand-accent mb-4">Ошибка 404</h2>
        <p className="text-neutral-400 mb-6">{error || 'Анкета не найдена'}</p>
        <Link to="/" className="px-6 py-2 border border-neutral-800 text-white rounded-full hover:bg-neutral-900 transition">
          Вернуться назад
        </Link>
      </div>
    );
  }

  const currentPrice = calculatePrice(profile.price || 0, duration);
  const SUPPORT_LINK = "https://t.me/onenight_support"; 

  return (
    <div className="min-h-screen pb-32 bg-brand-black text-white">
      {/* Navbar */}
      <div className="sticky top-0 z-40 bg-brand-black/90 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-neutral-400 hover:text-brand-accent transition">
          <ArrowLeft size={20} />
        </button>
        <span className="font-medium text-sm tracking-widest uppercase text-white/80">Профиль</span>
        <div className="w-8" />
      </div>

      <div className="max-w-5xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Left Column: Gallery */}
          <div>
            <Gallery images={profile.photo_urls && profile.photo_urls.length > 0 ? profile.photo_urls : [profile.photo_url || '']} />
          </div>

          {/* Right Column: Info & Order */}
          <div className="space-y-8">
            
            {/* Header Info */}
            <div className="border-b border-white/5 pb-6">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-4xl font-light text-white">{profile.name}</h1>
                <div className="flex items-center gap-1 text-brand-accent">
                   <Star size={16} fill="currentColor" />
                   <span className="text-sm font-medium">VIP</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-neutral-400 mb-4">
                 <span className="bg-white/5 px-2 py-0.5 rounded text-white">{profile.age} лет</span>
                 <div className="flex items-center gap-1">
                    <MapPin size={14} className="text-brand-accent" />
                    <span>{profile.cities?.name}</span>
                 </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="space-y-1">
                  <div className="text-xs text-neutral-500 uppercase tracking-wider flex items-center gap-1">
                    <Ruler size={12} /> Рост
                  </div>
                  <div className="text-lg font-light">{profile.height} <span className="text-sm text-neutral-500">см</span></div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-neutral-500 uppercase tracking-wider flex items-center gap-1">
                    <Weight size={12} /> Вес
                  </div>
                  <div className="text-lg font-light">{profile.weight} <span className="text-sm text-neutral-500">кг</span></div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-neutral-500 uppercase tracking-wider flex items-center gap-1">
                    <Info size={12} /> Грудь
                  </div>
                  <div className="text-lg font-light">{profile.breast_size}</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xs font-bold text-brand-accent uppercase tracking-widest mb-3">О модели</h3>
              <p className="text-neutral-300 leading-relaxed font-light text-sm md:text-base">
                {profile.description || "Описание отсутствует."}
              </p>
            </div>

            {/* Order / Payment Section */}
            <div className="bg-neutral-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm overflow-hidden relative">
              <AnimatePresence mode="wait">
                {bookingStep === 'select' ? (
                  <motion.div
                    key="select"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="flex items-center gap-2 mb-6">
                      <Clock size={18} className="text-brand-accent" />
                      <span className="text-sm font-medium uppercase tracking-widest text-neutral-300">Выберите время</span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 mb-8">
                      {(['1h', '2h', 'night'] as const).map((d) => (
                        <button
                          key={d}
                          onClick={() => setDuration(d)}
                          className={`py-3 px-1 rounded-lg border text-sm transition-all duration-300 relative overflow-hidden ${
                            duration === d
                              ? 'bg-brand-accent/10 border-brand-accent text-brand-accent'
                              : 'bg-transparent text-neutral-500 border-white/10 hover:border-white/30 hover:text-white'
                          }`}
                        >
                          <div className="text-[10px] uppercase tracking-wider mb-0.5 font-semibold">
                              {d === '1h' ? '1 Час' : d === '2h' ? '2 Часа' : 'Ночь'}
                          </div>
                          <div className="font-medium">
                              {formatPrice(calculatePrice(profile.price || 0, d))}
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-lg font-light pt-4 border-t border-white/5">
                        <span className="text-neutral-400">Итого:</span>
                        <span className="text-2xl text-white font-normal">{formatPrice(currentPrice)}</span>
                      </div>

                      <button 
                        onClick={handleBooking}
                        disabled={!profile.is_available}
                        className={`w-full py-4 rounded-xl font-medium text-sm uppercase tracking-widest transition-all transform active:scale-[0.99] ${
                          profile.is_available 
                            ? 'bg-gradient-to-r from-brand-accent to-violet-600 text-white shadow-lg shadow-violet-900/20 hover:shadow-violet-700/30' 
                            : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                        }`}
                      >
                        {profile.is_available ? 'Забронировать' : 'Временно недоступна'}
                      </button>
                      
                      <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-600 mt-3">
                         <ShieldCheck size={12} />
                         <span>Анонимность гарантирована</span>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <button 
                      onClick={() => setBookingStep('select')}
                      className="absolute top-0 right-0 p-4 text-neutral-500 hover:text-white text-xs uppercase tracking-widest"
                    >
                      Назад
                    </button>

                    <h3 className="text-lg font-light text-white mb-6">Подтверждение</h3>

                    <div className="bg-white/5 p-4 rounded-xl mb-6">
                       <div className="flex justify-between text-sm text-neutral-400 mb-1">
                          <span>Сумма к оплате:</span>
                       </div>
                       <div className="text-3xl font-normal text-brand-accent">
                          {formatPrice(currentPrice)}
                       </div>
                    </div>

                    {/* Payment Details Section */}
                    <div className="mb-6">
                       <label className="text-xs text-neutral-500 uppercase tracking-wider mb-2 block">Реквизиты для оплаты</label>
                       <div className="bg-neutral-800/50 border border-white/10 rounded-xl p-4 flex items-start justify-between gap-4">
                          <div className="font-mono text-sm text-white/90 break-all whitespace-pre-wrap leading-relaxed">
                            {paymentDetails}
                          </div>
                          <button 
                            onClick={() => copyToClipboard(paymentDetails)}
                            className="text-neutral-400 hover:text-brand-accent p-1.5 hover:bg-white/5 rounded-lg transition-colors"
                            title="Скопировать"
                          >
                            <Copy size={16} />
                          </button>
                       </div>
                    </div>

                    <div className="mb-6">
                      <label className="text-xs text-neutral-500 uppercase tracking-wider mb-2 block">Промокод (если есть)</label>
                      <input 
                        type="text" 
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="CODE2024"
                        className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white placeholder-neutral-600 focus:border-brand-accent/50 focus:ring-0 transition-colors text-sm"
                      />
                    </div>

                    <div className="bg-violet-500/10 border border-violet-500/20 p-4 rounded-xl mb-6">
                      <p className="text-xs md:text-sm text-violet-200/90 leading-relaxed">
                        Для завершения бронирования, пожалуйста, отправьте скриншот оплаты и ваш ID (или username) в службу поддержки.
                      </p>
                    </div>

                    <a 
                      href={SUPPORT_LINK} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-medium text-sm uppercase tracking-widest bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-all"
                    >
                      <Send size={18} />
                      Отправить в поддержку
                    </a>

                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;