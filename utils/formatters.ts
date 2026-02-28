import { PRICE_MULTIPLIERS } from '../constants';

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(price);
};

export const calculatePrice = (basePrice: number | string, duration: '1h' | '2h' | 'night'): number => {
  const priceNum = typeof basePrice === 'string' ? parseInt(basePrice.replace(/\D/g, ''), 10) : basePrice;
  
  if (isNaN(priceNum)) return 0;

  switch (duration) {
    case '1h':
      return priceNum;
    case '2h':
      return Math.floor(priceNum * PRICE_MULTIPLIERS['2h']);
    case 'night':
      return priceNum * PRICE_MULTIPLIERS['night'];
    default:
      return priceNum;
  }
};
