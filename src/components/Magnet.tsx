import { useEffect, useRef, type HTMLAttributes, type ReactNode } from 'react';

interface MagnetProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  children: ReactNode;
  padding?: number;
  disabled?: boolean;
  magnetStrength?: number;
  maxOffset?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  wrapperClassName?: string;
  innerClassName?: string;
}

const clamp = (value: number, limit: number) => Math.max(-limit, Math.min(limit, value));

export default function Magnet({
  children,
  padding = 100,
  disabled = false,
  magnetStrength = 2,
  maxOffset = 5,
  activeTransition = 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
  inactiveTransition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
  wrapperClassName = '',
  innerClassName = '',
  ...props
}: MagnetProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)');
    const coarsePointer = window.matchMedia('(pointer: coarse)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frameId: number | null = null;
    let listening = false;
    let active = false;
    let touchActive = false;
    let latestEvent: PointerEvent | null = null;

    const reset = () => {
      active = false;
      if (!innerRef.current) return;
      innerRef.current.style.transition = inactiveTransition;
      innerRef.current.style.transform = 'translate3d(0, 0, 0)';
    };

    const renderPosition = () => {
      frameId = null;
      const event = latestEvent;
      const wrapper = wrapperRef.current;
      const inner = innerRef.current;
      if (!event || !wrapper || !inner) return;

      const { left, top, width, height } = wrapper.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      const withinX = Math.abs(centerX - event.clientX) < width / 2 + padding;
      const withinY = Math.abs(centerY - event.clientY) < height / 2 + padding;

      if (!withinX || !withinY) {
        if (active) reset();
        return;
      }

      active = true;
      const x = clamp((event.clientX - centerX) / magnetStrength, maxOffset);
      const y = clamp((event.clientY - centerY) / magnetStrength, maxOffset);
      inner.style.transition = activeTransition;
      inner.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    };

    const handleTouchStart = (event: PointerEvent) => {
      if (!event.isPrimary || event.pointerType !== 'touch' || !wrapperRef.current || !innerRef.current || reducedMotion.matches) return;
      const { left, top, width, height } = wrapperRef.current.getBoundingClientRect();
      const x = clamp((event.clientX - (left + width / 2)) * 0.14, maxOffset);
      const y = clamp((event.clientY - (top + height / 2)) * 0.14, maxOffset);
      touchActive = true;
      innerRef.current.style.transition = activeTransition;
      innerRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1.04)`;
      try { wrapperRef.current.setPointerCapture?.(event.pointerId); } catch {}
    };

    const handleTouchEnd = (event: PointerEvent) => {
      if (event.pointerType !== 'touch' || !touchActive) return;
      touchActive = false;
      reset();
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!event.isPrimary || event.pointerType === 'touch') return;
      latestEvent = event;
      if (frameId === null) frameId = requestAnimationFrame(renderPosition);
    };

    const removePointerListener = () => {
      if (!listening) return;
      listening = false;
      window.removeEventListener('pointermove', handlePointerMove);
      wrapperRef.current?.removeEventListener('pointerdown', handleTouchStart);
      window.removeEventListener('pointerup', handleTouchEnd);
      window.removeEventListener('pointercancel', handleTouchEnd);
    };

    const updateAvailability = () => {
      const enabled = !disabled && !reducedMotion.matches && (finePointer.matches || coarsePointer.matches);
      if (enabled && !listening) {
        listening = true;
        window.addEventListener('pointermove', handlePointerMove, { passive: true });
        wrapperRef.current?.addEventListener('pointerdown', handleTouchStart);
        window.addEventListener('pointerup', handleTouchEnd);
        window.addEventListener('pointercancel', handleTouchEnd);
      } else if (!enabled) {
        removePointerListener();
        reset();
      }
    };

    finePointer.addEventListener('change', updateAvailability);
    coarsePointer.addEventListener('change', updateAvailability);
    reducedMotion.addEventListener('change', updateAvailability);
    updateAvailability();

    return () => {
      removePointerListener();
      finePointer.removeEventListener('change', updateAvailability);
      coarsePointer.removeEventListener('change', updateAvailability);
      reducedMotion.removeEventListener('change', updateAvailability);
      if (frameId !== null) cancelAnimationFrame(frameId);
      frameId = null;
      latestEvent = null;
      reset();
    };
  }, [activeTransition, disabled, inactiveTransition, magnetStrength, maxOffset, padding]);

  return (
    <div ref={wrapperRef} className={wrapperClassName} {...props}>
      <div ref={innerRef} className={innerClassName}>
        {children}
      </div>
    </div>
  );
}
