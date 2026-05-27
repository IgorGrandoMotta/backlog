// src/components/StarRating.jsx
import { useState } from 'react';

export function StarRating({ value = 0, onChange, readOnly = false, size = 18 }) {
  const [hover, setHover] = useState(0);
  const active = hover || value;

  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          width={size} height={size} viewBox="0 0 24 24" fill="none"
          style={{ cursor: readOnly ? 'default' : 'pointer', flexShrink: 0 }}
          onClick={() => !readOnly && onChange?.(n === value ? 0 : n)}
          onMouseEnter={() => !readOnly && setHover(n)}
          onMouseLeave={() => !readOnly && setHover(0)}
        >
          <polygon
            points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
            fill={n <= active ? '#fbbf24' : 'transparent'}
            stroke={n <= active ? '#fbbf24' : 'rgba(255,255,255,0.2)'}
            strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round"
            style={{ transition: 'all 0.15s' }}
          />
        </svg>
      ))}
    </div>
  );
}
