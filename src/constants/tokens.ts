export const TOKENS = {
  SPACING: {
    XS: '0.25rem',    // 4px
    SM: '0.5rem',     // 8px
    MD: '1rem',       // 16px
    LG: '1.5rem',     // 24px
    XL: '2rem',       // 32px
    XXL: '3rem',      // 48px
  },
  RADIUS: {
    SM: '0.5rem',
    MD: '0.75rem',
    LG: '1rem',
    XL: '1.5rem',
    XXL: '2rem',
    FULL: '9999px',
  },
  ICON_SIZES: {
    SM: 12,
    MD: 16,
    LG: 20,
    XL: 24,
    XXL: 32,
    XXXL: 48,
  },
  ANIMATION: {
    SPRING: 'spring',
    HIDDEN: 'hidden',
    VISIBLE: 'visible',
    REDUCED_MOTION: 'user',
  },
  TRANSITION: {
    PAGE: { duration: 0.5, ease: [0.23, 1, 0.32, 1] as const },
    DRAWER: { type: 'spring', damping: 25, stiffness: 200 } as const,
    FAST: { duration: 0.2 },
    NORMAL: { duration: 0.3 },
    SLOW: { duration: 0.5 },
    SPRING: { type: 'spring', stiffness: 300, damping: 25 } as const,
    FLOAT: { repeat: Infinity, duration: 3, ease: 'easeInOut' as const },
    PULSE: { repeat: Infinity, duration: 2 },
    ARROW: { repeat: Infinity, duration: 1.5 },
  },
  DURATION: {
    INSTANT: 150,     // micro-interactions
    FAST: 200,        // exits
    NORMAL: 300,      // entrances
    SLOW: 500,        // page transitions
  },
  EASING: {
    ENTRANCE: 'ease-out',
    EXIT: 'ease-in',
    TRANSITION: 'ease-in-out',
    SPRING: [0.23, 1, 0.32, 1] as const,
  },
  SHADOW: {
    SM: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    MD: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    LG: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    XL: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  },
  TYPOGRAPHY: {
    FONT_FAMILY: {
      DISPLAY: '"Plus Jakarta Sans", system-ui, sans-serif',
      BODY: '"DM Sans", system-ui, sans-serif',
    },
    SCALE: {
      XS: '0.625rem',   // 10px
      SM: '0.75rem',    // 12px
      MD: '0.875rem',   // 14px
      LG: '1rem',       // 16px
      XL: '1.25rem',    // 20px
      XXL: '1.5rem',    // 24px
      XXXL: '1.875rem', // 30px
    },
  },
  CONTENT_WIDTH: {
    SM: '28rem',
    MD: '48rem',
    LG: '64rem',
    XL: '80rem',
  },
} as const;
