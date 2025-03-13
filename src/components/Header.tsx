
import React from 'react';
import { cn } from '@/lib/utils';
import { Pill } from 'lucide-react';

interface HeaderProps {
  className?: string;
}

const Header = ({ className }: HeaderProps) => {
  return (
    <header className={cn("flex items-center justify-center py-6", className)}>
      <div className="flex items-center space-x-2 animate-slide-down">
        <Pill size={24} className="text-primary" />
        <span className="text-xl font-semibold tracking-tight">PharmaScan</span>
      </div>
    </header>
  );
};

export default Header;
