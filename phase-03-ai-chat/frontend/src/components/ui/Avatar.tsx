'use client';

import { forwardRef, type ImgHTMLAttributes, useState } from 'react';
import { cn, getInitials } from '@/lib/utils';

export interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'size' | 'src'> {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, name = '', size = 'md', ...props }, ref) => {
    const [imageError, setImageError] = useState(false);

    const sizes = {
      sm: 'h-8 w-8 text-xs',
      md: 'h-10 w-10 text-sm',
      lg: 'h-12 w-12 text-base',
      xl: 'h-16 w-16 text-lg',
    };

    const initials = getInitials(name || alt || '');
    const showImage = src && !imageError;

    // Generate a consistent background color based on the name
    const getBackgroundColor = (str: string) => {
      const colors = [
        'bg-blue-500',
        'bg-green-500',
        'bg-purple-500',
        'bg-pink-500',
        'bg-indigo-500',
        'bg-teal-500',
        'bg-orange-500',
        'bg-cyan-500',
      ];
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      return colors[Math.abs(hash) % colors.length];
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center rounded-full overflow-hidden',
          'ring-2 ring-white dark:ring-gray-900',
          sizes[size],
          !showImage && getBackgroundColor(name || alt || ''),
          className
        )}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            className="h-full w-full object-cover"
            onError={() => setImageError(true)}
            {...props}
          />
        ) : (
          <span className="font-medium text-white" aria-label={alt || name}>
            {initials}
          </span>
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

// Avatar Group component for showing multiple avatars
interface AvatarGroupProps {
  avatars: Array<{ src?: string; name?: string; alt?: string }>;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function AvatarGroup({ avatars, max = 4, size = 'md', className }: AvatarGroupProps) {
  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  return (
    <div className={cn('flex -space-x-2', className)}>
      {visibleAvatars.map((avatar, index) => (
        <Avatar
          key={index}
          src={avatar.src}
          name={avatar.name}
          alt={avatar.alt}
          size={size}
        />
      ))}
      {remainingCount > 0 && (
        <div
          className={cn(
            'relative inline-flex items-center justify-center rounded-full',
            'bg-gray-200 dark:bg-gray-700 ring-2 ring-white dark:ring-gray-900',
            size === 'sm' && 'h-8 w-8 text-xs',
            size === 'md' && 'h-10 w-10 text-sm',
            size === 'lg' && 'h-12 w-12 text-base'
          )}
        >
          <span className="font-medium text-gray-600 dark:text-gray-300">
            +{remainingCount}
          </span>
        </div>
      )}
    </div>
  );
}

export { Avatar, AvatarGroup };
