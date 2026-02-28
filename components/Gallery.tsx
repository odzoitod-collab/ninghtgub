import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface GalleryProps {
  images: string[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  const [index, setIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Ensure we have at least one image
  const displayImages = images.length > 0 ? images : ['https://picsum.photos/800/600'];

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  return (
    <div className="relative">
      {/* Main Display */}
      <div 
        className="relative aspect-[3/4] md:aspect-video rounded-2xl overflow-hidden bg-neutral-900 cursor-pointer border border-neutral-800 group"
        onClick={() => setIsLightboxOpen(true)}
      >
        <motion.img
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          src={displayImages[index]}
          alt={`Gallery ${index}`}
          className="w-full h-full object-cover"
        />
        
        {/* Navigation Overlays */}
        {displayImages.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 backdrop-blur text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-brand-accent"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 backdrop-blur text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-brand-accent"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-white">
          {index + 1} / {displayImages.length}
        </div>
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2 no-scrollbar">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setIndex(idx)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                index === idx ? 'border-brand-accent ring-2 ring-brand-accent/30' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button 
              className="absolute top-4 right-4 text-white/50 hover:text-white p-2"
              onClick={() => setIsLightboxOpen(false)}
            >
              <X size={32} />
            </button>

            <div className="relative max-w-5xl max-h-[90vh] w-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
               <motion.img
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                src={displayImages[index]}
                className="max-w-full max-h-[85vh] rounded shadow-2xl"
              />
               {displayImages.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute -left-2 md:-left-12 top-1/2 -translate-y-1/2 p-3 text-white hover:text-brand-accent"
                  >
                    <ChevronLeft size={40} />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute -right-2 md:-right-12 top-1/2 -translate-y-1/2 p-3 text-white hover:text-brand-accent"
                  >
                    <ChevronRight size={40} />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
