import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-brand-black text-white font-sans selection:bg-brand-accent selection:text-white">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile/:code" element={<ProfilePage />} />
          </Routes>
        </main>
        
        {/* Simple Footer */}
        <footer className="bg-black py-8 border-t border-white/5 mt-auto">
          <div className="max-w-7xl mx-auto px-4 text-center text-neutral-600 text-sm">
            <p>&copy; {new Date().getFullYear()} Night Hub. Все права защищены.</p>
            <p className="mt-2 text-xs opacity-50">Строго 18+</p>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;