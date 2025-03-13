
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import Camera from '@/components/Camera';
import MedicineResult, { MedicineInfo } from '@/components/MedicineResult';
import ScanButton from '@/components/ScanButton';
import AnimatedTransition from '@/components/AnimatedTransition';
import Header from '@/components/Header';
import { ArrowLeft, Pill } from 'lucide-react';
import { analyzeMedicineImage } from '@/services/geminiService';
import { saveMedicineData } from '@/services/supabaseService';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const Index = () => {
  const { toast } = useToast();
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<MedicineInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStartScan = () => {
    setShowCamera(true);
    setError(null);
  };

  const handleCapture = async (imageData: string) => {
    setCapturedImage(imageData);
    setAnalyzing(true);
    setError(null);
    
    try {
      // Analyze the medicine image using Gemini
      const analysisResult = await analyzeMedicineImage(imageData);
      
      if (!analysisResult.success) {
        setError(analysisResult.message);
        toast({
          title: "Analysis Failed",
          description: analysisResult.message,
          variant: "destructive",
        });
      } else if (analysisResult.data) {
        setResult(analysisResult.data);
        toast({
          title: "Analysis Complete",
          description: "We've identified your medicine.",
        });
        
        // Save to Supabase if analysis was successful
        await saveMedicineData(analysisResult.data);
      }
    } catch (error) {
      console.error("Error in scanning process:", error);
      setError("An unexpected error occurred. Please try again.");
      toast({
        title: "Error",
        description: "An error occurred during scanning. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleBackToHome = () => {
    setShowCamera(false);
    setCapturedImage(null);
    setResult(null);
    setError(null);
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
                
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertTitle>Image Analysis Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
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
