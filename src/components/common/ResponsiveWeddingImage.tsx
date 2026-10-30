import React, { useState } from 'react';
import optimizedManifest from '../../data/optimized-images.json';

interface ResponsiveWeddingImageProps {
  id: string; // e.g. 'couple-01'
  alt: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  aspectRatio?: string;
  onClick?: () => void;
}

export const ResponsiveWeddingImage: React.FC<ResponsiveWeddingImageProps> = ({
  id,
  alt,
  className = '',
  imgClassName = '',
  priority = false,
  aspectRatio,
  onClick,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const data = (optimizedManifest as Record<string, any>)[id];

  // Fallback if id not in manifest
  const fallbackSrc = `/src/assets/prewedding/${id}.jpg`;
  const defaultSrc = data?.defaultSrc || fallbackSrc;
  const webpSrcSet = data?.webpSrcSet;
  const avifSrcSet = data?.avifSrcSet;
  const blurDataUrl = data?.blurDataUrl;
  const originalWidth = data?.originalWidth || 1200;
  const originalHeight = data?.originalHeight || 800;

  return (
    <div
      onClick={onClick}
      style={{
        backgroundImage: blurDataUrl ? `url(${blurDataUrl})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        aspectRatio: aspectRatio || `${originalWidth} / ${originalHeight}`,
      }}
      className={`relative overflow-hidden ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <picture>
        {avifSrcSet && <source type="image/avif" srcSet={avifSrcSet} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />}
        {webpSrcSet && <source type="image/webp" srcSet={webpSrcSet} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />}
        <img
          src={defaultSrc}
          alt={alt}
          width={originalWidth}
          height={originalHeight}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${imgClassName}`}
        />
      </picture>
    </div>
  );
};

