import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="relative">
        <div className="absolute inset-0 bg-brand-accent blur-xl opacity-20 rounded-full animate-pulse"></div>
        <Loader2 className="w-12 h-12 text-brand-accent animate-spin relative z-10" />
      </div>
    </div>
  );
};

export default Loader;
