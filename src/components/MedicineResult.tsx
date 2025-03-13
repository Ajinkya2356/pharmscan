
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, ArrowRight, ExternalLink, Plus, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

export interface MedicineInfo {
  name: string;
  description: string;
  ingredients: string[];
  price: string;
  availability: string;
  precautions: string[];
  alternatives?: string[];
}

interface MedicineResultProps {
  medicine: MedicineInfo;
  isLoading?: boolean;
  className?: string;
}

const MedicineResult = ({ medicine, isLoading = false, className }: MedicineResultProps) => {
  const [activeSection, setActiveSection] = useState<string>("info");

  if (isLoading) {
    return (
      <Card className={cn("w-full max-w-md mx-auto overflow-hidden animate-pulse", className)}>
        <div className="p-6 space-y-4">
          <div className="h-8 bg-secondary rounded-md w-3/4"></div>
          <div className="h-4 bg-secondary rounded-md w-full"></div>
          <div className="h-4 bg-secondary rounded-md w-5/6"></div>
          <div className="h-4 bg-secondary rounded-md w-4/6"></div>
          <Separator />
          <div className="h-4 bg-secondary rounded-md w-2/3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-secondary rounded-md w-full"></div>
            <div className="h-4 bg-secondary rounded-md w-full"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full max-w-md mx-auto overflow-hidden glass-morphism shadow-lg animate-scale-in", className)}>
      <div className="flex border-b border-border/40">
        <button
          onClick={() => setActiveSection("info")}
          className={cn(
            "flex-1 py-3 text-sm font-medium transition-colors",
            activeSection === "info" 
              ? "text-primary border-b-2 border-primary" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Information
        </button>
        {medicine.alternatives && medicine.alternatives.length > 0 && (
          <button
            onClick={() => setActiveSection("alternatives")}
            className={cn(
              "flex-1 py-3 text-sm font-medium transition-colors",
              activeSection === "alternatives" 
                ? "text-primary border-b-2 border-primary" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Alternatives
          </button>
        )}
      </div>

      <div className="p-6">
        {activeSection === "info" ? (
          <div className="space-y-5 animate-fade-in">
            <div>
              <Badge variant="outline" className="mb-2 text-xs font-normal text-muted-foreground">
                Medicine
              </Badge>
              <h2 className="text-2xl font-semibold tracking-tight">{medicine.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{medicine.description}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2 flex items-center gap-1.5">
                <Info size={14} />
                Ingredients
              </h3>
              <ul className="space-y-1">
                {medicine.ingredients.map((ingredient, i) => (
                  <li key={i} className="text-sm flex items-start gap-1.5">
                    <Plus size={12} className="mt-1 shrink-0 text-muted-foreground" />
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-xs font-medium text-muted-foreground mb-1">Price</h3>
                <p className="text-sm font-medium">{medicine.price}</p>
              </div>
              <div>
                <h3 className="text-xs font-medium text-muted-foreground mb-1">Availability</h3>
                <div className="flex items-center gap-1">
                  <p className="text-sm">{medicine.availability}</p>
                  <ExternalLink size={14} className="text-primary" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium flex items-center gap-1.5 mb-2">
                <AlertCircle size={14} className="text-destructive" />
                Precautions & Warnings
              </h3>
              <ul className="space-y-2">
                {medicine.precautions.map((precaution, i) => (
                  <li key={i} className="text-sm bg-destructive/5 border border-destructive/10 rounded-md p-2">
                    {precaution}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            <p className="text-sm text-muted-foreground">Similar medicines or alternatives that you might consider:</p>
            <ul className="space-y-3">
              {medicine.alternatives?.map((alt, i) => (
                <li key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                  <span className="font-medium">{alt}</span>
                  <ArrowRight size={16} className="text-primary" />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MedicineResult;
