import React, { useState } from 'react';
import { getInitials } from '../../../core/auth/authHelpers';

export interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  ring?: 'none' | 'wine' | 'sand' | 'border';
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  name = '',
  size = 'md',
  ring = 'border',
  className = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(!src);

  const sizeStyles = {
    xs: 'w-5 h-5 text-[9px]',
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-xs',
    lg: 'w-11 h-11 text-sm',
    xl: 'w-14 h-14 text-base font-bold',
    '2xl': 'w-16 h-16 text-lg font-bold',
  };

  const ringStyles = {
    none: '',
    wine: 'ring-2 ring-wine',
    sand: 'ring-2 ring-sand-dark',
    border: 'ring-1 ring-border',
  };

  if (hasError || !src) {
    return (
      <div
        className={`rounded-full bg-sand/80 text-wine font-semibold flex items-center justify-center shrink-0 ${sizeStyles[size]} ${ringStyles[ring]} ${className}`}
        aria-label={name || alt}
      >
        {getInitials(name || alt)}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      className={`rounded-full object-cover shrink-0 ${sizeStyles[size]} ${ringStyles[ring]} ${className}`}
      {...props}
    />
  );
};

