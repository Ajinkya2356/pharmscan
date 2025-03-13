
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import Camera from '@/components/Camera';
import MedicineResult, { MedicineInfo } from '@/components/MedicineResult';
import ScanButton from '@/components/ScanButton';
import AnimatedTransition from '@/components/AnimatedTransition';
import Header from '@/components/Header';
import { ArrowLeft } from 'lucide-react';

const Index = () => {
  const { toast } = useToast();
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<MedicineInfo | null>(null);

  const handleStartScan = () => {
    setShowCamera(true);
  };

  const handleCapture = (imageData: string) => {
    setCapturedImage(imageData);
    setAnalyzing(true);
    
    // Simulate API call to analyze medicine
    setTimeout(() => {
      // Mock data - in a real app this would come from an AI image analysis
      const mockResult: MedicineInfo = {
        name: "Acetaminophen 500mg",
        description: "Pain reliever and fever reducer for temporary relief of minor aches and pains.",
        ingredients: [
          "Acetaminophen 500mg (active ingredient)",
          "Corn starch",
          "Hypromellose",
          "Povidone",
          "Stearic acid"
        ],
        price: "$8.99 - $12.49",
        availability: "Available in most pharmacies",
        precautions: [
          "Do not use with other medicines containing acetaminophen",
          "Do not take more than directed (max 4000mg daily)",
          "Alcohol warning: May cause liver damage",
          "Consult a doctor if symptoms persist"
        ],
        alternatives: [
          "Ibuprofen 200mg",
          "Aspirin 325mg",
          "Naproxen Sodium 220mg"
        ]
      };
      
      setResult(mockResult);
      setAnalyzing(false);
      
      toast({
        title: "Analysis Complete",
        description: "We've identified your medicine.",
      });
    }, 3000);
  };

  const handleBackToHome = () => {
    setShowCamera(false);
    setCapturedImage(null);
    setResult(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-8">
        {!showCamera ? (
          <div className="flex flex-col items-center text-center space-y-8 animate-fade-in w-full max-w-md">
            <div className="space-y-4 mb-4">
              <h1 className="text-4xl font-bold tracking-tight">Medicine Scanner</h1>
              <p className="text-muted-foreground max-w-sm">
                Take a photo of any medicine label to identify details, ingredients, and precautions.
              </p>
            </div>
            
            <div className="w-60 h-60 rounded-full bg-primary/5 flex items-center justify-center">
              <div className="w-48 h-48 rounded-full bg-primary/10 flex items-center justify-center">
                <div className="w-36 h-36 rounded-full bg-primary/20 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white">
                    <Pill size={40} />
                  </div>
                </div>
              </div>
            </div>
            
            <ScanButton onClick={handleStartScan} className="mt-8" />
          </div>
        ) : (
          <div className="w-full">
            {capturedImage && result ? (
              <AnimatedTransition show={true} className="w-full">
                <button 
                  onClick={handleBackToHome}
                  className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
                >
                  <ArrowLeft size={16} className="mr-1" />
                  Back to home
                </button>
                <MedicineResult medicine={result} />
              </AnimatedTransition>
            ) : (
              <AnimatedTransition show={true} className="w-full">
                <div className="space-y-4 mb-6">
                  <button 
                    onClick={handleBackToHome}
                    className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft size={16} className="mr-1" />
                    Back to home
                  </button>
                  <h2 className="text-2xl font-semibold tracking-tight">Scan Medicine Label</h2>
                  <p className="text-sm text-muted-foreground">
                    Position medicine packaging with clear view of label
                  </p>
                </div>
                
                <Camera onCapture={handleCapture} />
                
                {analyzing && (
                  <div className="mt-8 text-center animate-pulse">
                    <p className="text-primary font-medium">Analyzing medicine...</p>
                    <p className="text-sm text-muted-foreground mt-1">This may take a moment</p>
                  </div>
                )}
              </AnimatedTransition>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
