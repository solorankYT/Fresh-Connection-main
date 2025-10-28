'use client';

import * as React from 'react';
import { StarIcon as SolidStar } from '@heroicons/react/24/solid';
import { StarIcon as OutlineStar } from '@heroicons/react/24/outline';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 20,
  interactive = false,
  onChange,
  className = '',
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = React.useState(0);

  const handleClick = (starRating: number) => {
    if (interactive && onChange) {
      onChange(starRating === rating ? 0 : starRating);
    }
  };

  const handleMouseEnter = (starRating: number) => {
    if (interactive) {
      setHoverRating(starRating);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  return (
    <div 
      className={`flex items-center gap-1 ${className}`}
      onMouseLeave={handleMouseLeave}
    >
      {[...new Array(maxRating)].map((_, i) => {
        const starRating = i + 1;
        const isFilled = (hoverRating || rating) >= starRating;
        const StarComponent = isFilled ? SolidStar : OutlineStar;
        
        return (
          <button
            key={starRating}
            type="button"
            onClick={() => handleClick(starRating)}
            onMouseEnter={() => handleMouseEnter(starRating)}
            className={`text-yellow-400 transition-colors ${
              interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'
            }`}
            disabled={!interactive}
            aria-label={`Rate ${starRating} out of ${maxRating} stars`}
          >
            <StarComponent
              style={{ width: size, height: size }}
              className="transition-transform"
            />
          </button>
        );
      })}
    </div>
  );
}
