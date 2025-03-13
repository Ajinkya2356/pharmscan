
import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedTransitionProps {
  show: boolean;
  children: React.ReactNode;
  className?: string;
  onExited?: () => void;
}

const AnimatedTransition = ({ show, children, className, onExited }: AnimatedTransitionProps) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!show && nodeRef.current) {
      const onAnimationEnd = () => {
        onExited?.();
      };
      
      const element = nodeRef.current;
      element.addEventListener('animationend', onAnimationEnd);
      
      return () => {
        element.removeEventListener('animationend', onAnimationEnd);
      };
    }
  }, [show, onExited]);

  if (!show && !nodeRef.current) return null;
  
  return (
    <div 
      ref={nodeRef}
      className={cn(
        "transition-all duration-500 ease-out",
        show ? "animate-scale-in" : "animate-fade-out",
        className
      )}
    >
      {children}
    </div>
  );
};

export default AnimatedTransition;
