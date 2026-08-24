import { useEffect, useState, type CSSProperties } from 'react';
import { motion, useReducedMotion, type MotionStyle, type Transition } from 'framer-motion';

interface BorderBeamProps {
  size?: number;
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
  transition?: Transition;
  className?: string;
  style?: CSSProperties;
  reverse?: boolean;
  initialOffset?: number;
  borderWidth?: number;
}

export function BorderBeam({
  className = '',
  size = 50,
  delay = 0,
  duration = 6,
  colorFrom = '#ffaa40',
  colorTo = '#9c40ff',
  transition,
  style,
  reverse = false,
  initialOffset = 0,
  borderWidth = 1,
}: BorderBeamProps) {
  const reducedMotion = useReducedMotion();
  const [compactPointer, setCompactPointer] = useState(false);

  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 700px), (pointer: coarse)');
    const update = () => setCompactPointer(mobile.matches);
    mobile.addEventListener('change', update);
    update();
    return () => mobile.removeEventListener('change', update);
  }, []);

  if (reducedMotion || compactPointer) return null;

  return (
    <div
      className={`border-beam ${className}`.trim()}
      style={{ '--border-beam-width': `${borderWidth}px` } as CSSProperties}
      aria-hidden="true"
      data-border-beam
    >
      <motion.div
        className="border-beam__light"
        style={
          {
            width: size,
            offsetPath: `rect(0 auto auto 0 round ${size}px)`,
            '--beam-color-from': colorFrom,
            '--beam-color-to': colorTo,
            ...style,
          } as MotionStyle
        }
        initial={{ offsetDistance: `${initialOffset}%` }}
        animate={{
          offsetDistance: reverse
            ? [`${100 - initialOffset}%`, `${-initialOffset}%`]
            : [`${initialOffset}%`, `${100 + initialOffset}%`],
        }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration,
          delay: -delay,
          ...transition,
        }}
      />
    </div>
  );
}
