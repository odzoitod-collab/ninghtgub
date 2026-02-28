import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchCode, setSearchCode] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCode.trim().length === 6) {
      navigate(`/profile/${searchCode.trim()}`);
      setIsSearchOpen(false);
      setSearchCode('');
    } else {
      // Small vibration or red border logic could go here, for now just alert
      alert("Введите 6 цифр ID");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-brand-black/90 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo or Search Input */}
          <div className="flex-1 flex items-center">
            <AnimatePresence mode="wait">
              {isSearchOpen ? (
                <motion.form 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onSubmit={handleSearch} 
                  className="w-full max-w-xs flex items-center gap-2"
                >
                  <Search size={16} className="text-brand-accent shrink-0" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Поиск по ID (6 цифр)"
                    value={searchCode}
                    onChange={(e) => setSearchCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-neutral-600 text-sm p-0"
                  />
                  <button 
                    type="button" 
                    onClick={() => setIsSearchOpen(false)}
                    className="p-1 text-neutral-400 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 group"
                >
                  <Link to="/" className="flex items-center gap-2">
                    <Sparkles size={18} className="text-brand-accent" />
                    <span className="text-xl font-light tracking-widest text-white uppercase group-hover:text-brand-accent transition-colors duration-300">
                      Night Hub
                    </span>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Search Trigger (only visible if search is closed) */}
          {!isSearchOpen && (
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-6 text-xs text-neutral-500 tracking-wider uppercase">
                <span>Premium</span>
                <div className="w-1 h-1 rounded-full bg-neutral-800"></div>
                <span>Private</span>
              </div>
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-neutral-400 hover:text-brand-accent transition-colors"
              >
                <Search size={18} />
              </button>
            </div>
          )}

        </div>
      </div>
    </header>
  );
};

export default Header;