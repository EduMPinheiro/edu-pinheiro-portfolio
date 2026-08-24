import { useEffect, useMemo, useRef, useState, type HTMLAttributes } from 'react';

type RevealDirection = 'start' | 'end' | 'center';
type AnimateOn = 'view' | 'mount';

interface DecryptedTextProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: RevealDirection;
  useOriginalCharsOnly?: boolean;
  characters?: string;
  parentClassName?: string;
  encryptedClassName?: string;
  animateOn?: AnimateOn;
  duration?: number;
}

const DEFAULT_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/+:._';

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function revealOrder(length: number, direction: RevealDirection) {
  if (direction === 'end') return Array.from({ length }, (_, index) => length - index - 1);
  if (direction === 'center') {
    const middle = Math.floor((length - 1) / 2);
    return Array.from({ length }, (_, index) => {
      if (index === 0) return middle;
      const offset = Math.ceil(index / 2);
      return index % 2 ? Math.min(length - 1, middle + offset) : Math.max(0, middle - offset);
    });
  }
  return Array.from({ length }, (_, index) => index);
}

export default function DecryptedText({
  text,
  speed = 25,
  maxIterations = 6,
  sequential = true,
  revealDirection = 'start',
  useOriginalCharsOnly = false,
  characters = DEFAULT_CHARACTERS,
  parentClassName = '',
  encryptedClassName = '',
  animateOn = 'view',
  duration = 350,
  className = '',
  ...props
}: DecryptedTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const frameRef = useRef<number | null>(null);
  const [displayText, setDisplayText] = useState(text);
  const [running, setRunning] = useState(false);
  const availableCharacters = useMemo(() => {
    const source = useOriginalCharsOnly
      ? Array.from(new Set(text.replaceAll(' ', ''))).join('')
      : characters;
    return source || DEFAULT_CHARACTERS;
  }, [characters, text, useOriginalCharsOnly]);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let observer: IntersectionObserver | null = null;
    let active = true;

    const stop = () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    };

    const showFinalText = () => {
      stop();
      setRunning(false);
      setDisplayText(text);
    };

    const start = () => {
      if (!active || reducedMotion.matches || prefersReducedMotion()) {
        showFinalText();
        return;
      }

      stop();
      setRunning(true);
      const startedAt = performance.now();
      const order = revealOrder(text.length, revealDirection);
      const safeDuration = Math.min(450, Math.max(300, duration));
      let lastShuffleAt = -Infinity;
      let lastIteration = -1;

      const tick = () => {
        const now = performance.now();
        const elapsed = now - startedAt;
        const progress = Math.min(1, elapsed / safeDuration);
        const iterations = Math.min(maxIterations, Math.floor(progress * maxIterations));
        const revealProgress = sequential ? progress : iterations / Math.max(1, maxIterations);
        const revealCount = Math.floor(revealProgress * text.length);
        const revealed = new Set(order.slice(0, revealCount));

        if ((iterations !== lastIteration && now - lastShuffleAt >= speed) || progress === 1) {
          lastShuffleAt = now;
          lastIteration = iterations;
          setDisplayText(
            Array.from(text, (character, index) => {
              if (character === ' ' || revealed.has(index) || progress === 1) return character;
              return availableCharacters[Math.floor(Math.random() * availableCharacters.length)];
            }).join(''),
          );
        }

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(tick);
        } else {
          frameRef.current = null;
          setRunning(false);
          setDisplayText(text);
        }
      };

      frameRef.current = requestAnimationFrame(tick);
    };

    const handlePreferenceChange = () => {
      if (reducedMotion.matches) showFinalText();
      else start();
    };

    reducedMotion.addEventListener('change', handlePreferenceChange);

    if (animateOn === 'view' && 'IntersectionObserver' in window) {
      const element = containerRef.current;
      const rect = element?.getBoundingClientRect();
      const isAlreadyVisible = Boolean(
        rect && rect.bottom >= 0 && rect.right >= 0 && rect.top <= innerHeight && rect.left <= innerWidth,
      );

      if (isAlreadyVisible) {
        start();
      } else {
        observer = new IntersectionObserver(
          ([entry]) => {
            if (!entry?.isIntersecting) return;
            observer?.disconnect();
            start();
          },
          { threshold: 0.1 },
        );
        if (element) observer.observe(element);
      }
    } else {
      start();
    }

    return () => {
      active = false;
      stop();
      observer?.disconnect();
      reducedMotion.removeEventListener('change', handlePreferenceChange);
    };
  }, [animateOn, availableCharacters, duration, maxIterations, revealDirection, sequential, speed, text]);

  return (
    <span
      ref={containerRef}
      className={parentClassName}
      aria-label={text}
      data-decrypted-text
      data-decrypting={running ? 'true' : 'false'}
      {...props}
    >
      <span className={running ? encryptedClassName : className} aria-hidden="true">
        {displayText}
      </span>
    </span>
  );
}
