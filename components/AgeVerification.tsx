import React, { useState, useEffect } from 'react';

export const AgeVerification: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isVerified = localStorage.getItem('age-verified');
    if (!isVerified) {
      setIsVisible(true);
    }
  }, []);

  const handleVerify = () => {
    localStorage.setItem('age-verified', 'true');
    setIsVisible(false);
  };

  const handleReject = () => {
    window.location.href = 'https://www.google.com';
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop with heavy blur and darkness */}
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" />

      <div className="relative bg-dark-800 border-2 border-violet-500 rounded-2xl p-8 max-w-sm w-full text-center shadow-[0_0_50px_rgba(139,92,246,0.3)] animate-fade-in">
        <div className="w-20 h-20 bg-dark-900 border border-violet-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl font-bold text-violet-500">18+</span>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-wider">Доступ ограничен</h2>
        <p className="text-gray-400 mb-8 leading-relaxed">
          Вам уже исполнилось 18 лет?
          <br />
          Данный сайт содержит материалы для взрослых.
        </p>

        <div className="space-y-3">
          <button 
            onClick={handleVerify}
            className="w-full py-4 bg-violet-500 hover:bg-violet-600 text-white font-bold rounded-xl text-lg transition-transform active:scale-[0.98]"
          >
            Да, мне есть 18 лет
          </button>
          <button 
            onClick={handleReject}
            className="w-full py-4 bg-dark-700 hover:bg-dark-600 text-gray-400 hover:text-white font-medium rounded-xl transition-colors"
          >
            Покинуть сайт
          </button>
        </div>
        
        <p className="mt-6 text-[10px] text-gray-600 uppercase tracking-widest">NightHub Responsible Dating</p>
      </div>
    </div>
  );
};