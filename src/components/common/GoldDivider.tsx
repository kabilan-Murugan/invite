import React from 'react';

interface GoldDividerProps {
  className?: string;
  variant?: 'lotus' | 'paisley' | 'knot' | 'simple';
}

export const GoldDivider: React.FC<GoldDividerProps> = ({ className = '', variant = 'lotus' }) => {
  return (
    <div className={`flex items-center justify-center my-6 gap-3 ${className}`}>
      <div className="h-[1px] w-16 sm:w-28 bg-gradient-to-r from-transparent via-[#C9A227] to-[#C9A227]" />
      
      {variant === 'lotus' && (
        <svg className="w-6 h-6 text-[#C9A227] opacity-90" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C12 2 13.5 6 15 8C16.5 10 18.5 11 18.5 13C18.5 16.5 15.5 19 12 19C8.5 19 5.5 16.5 5.5 13C5.5 11 7.5 10 9 8C10.5 6 12 2 12 2Z" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M12 5C12 5 13 8 14 9.5C15 11 16 12 16 13.5C16 15.5 14.2 17 12 17C9.8 17 8 15.5 8 13.5C8 12 9 11 10 9.5C11 8 12 5 12 5Z" stroke="currentColor" strokeWidth="1"/>
          <circle cx="12" cy="13" r="2" fill="currentColor"/>
        </svg>
      )}

      {variant === 'paisley' && (
        <svg className="w-6 h-6 text-[#C9A227]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 3C7 3 4 7 4 11C4 16 8 20 13 20C17 20 20 17 20 13C20 9 17 7 14 7C11 7 9 9 9 11C9 12.5 10 13.5 11.5 13.5C13 13.5 14 12.5 14 11C14 8 12 3 12 3Z"/>
        </svg>
      )}

      {variant === 'knot' && (
        <div className="w-2.5 h-2.5 rotate-45 border border-[#C9A227] bg-[#FFF8F0]" />
      )}

      {variant === 'simple' && (
        <div className="w-2 h-2 rounded-full bg-[#C9A227]" />
      )}

      <div className="h-[1px] w-16 sm:w-28 bg-gradient-to-l from-transparent via-[#C9A227] to-[#C9A227]" />
    </div>
  );
};

