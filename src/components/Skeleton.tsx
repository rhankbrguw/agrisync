import type { HTMLAttributes } from 'react';

type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'rounded';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
}

export function Skeleton({ 
  className = '', 
  variant = 'text',
  ...props 
}: SkeletonProps) {
  const baseClass = 'animate-pulse bg-surface/50 border border-border';
  
  let variantClass = '';
  switch (variant) {
    case 'text':
      variantClass = 'h-4 w-full rounded-md';
      break;
    case 'circular':
      variantClass = 'rounded-full';
      break;
    case 'rectangular':
      variantClass = '';
      break;
    case 'rounded':
      variantClass = 'rounded-xl';
      break;
  }

  return (
    <div className={`${baseClass} ${variantClass} ${className}`} {...props} />
  );
}
