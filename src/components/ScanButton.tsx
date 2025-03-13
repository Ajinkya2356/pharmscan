
import React from 'react';
import { cn } from '@/lib/utils';
import { ScanLine } from 'lucide-react';

interface ScanButtonProps {
  onClick: () => void;
  className?: string;
}

const ScanButton = ({ onClick, className }: ScanButtonProps) => {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "relative flex items-center justify-center py-4 px-8 rounded-2xl bg-primary text-white font-medium",
        "hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-out",
        "shadow-[0_8px_30px_rgb(0,122,255,0.3)]",
        "after:content-[''] after:absolute after:inset-0 after:rounded-2xl",
        "after:bg-primary after:opacity-20 after:animate-pulse",
        "after:transition-all after:duration-300",
        className
      )}
    >
      <ScanLine size={20} className="mr-2" />
      <span>Scan Medicine</span>
    </button>
  );
};

export default ScanButton;
