
import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Camera as CameraIcon, X, Image, AlignCenter, Loader2 } from 'lucide-react';

interface CameraProps {
  onCapture: (imageData: string) => void;
  className?: string;
}

const Camera = ({ onCapture, className }: CameraProps) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulating a camera capture - in a real app, this would use the device camera
  const handleCapture = () => {
    setIsCapturing(true);
    
    // Simulate a delay for the camera to "focus"
    setTimeout(() => {
      // In a real implementation, this would get an actual camera image
      // For our demo, we're using a placeholder
      const mockImageData = "/placeholder.svg";
      setCapturedImage(mockImageData);
      onCapture(mockImageData);
      setIsCapturing(false);
    }, 1500);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsCapturing(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setCapturedImage(imageData);
        onCapture(imageData);
        setIsCapturing(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const resetCamera = () => {
    setCapturedImage(null);
  };

  return (
    <div className={cn("relative w-full max-w-md mx-auto", className)}>
      <div className="w-full aspect-[3/4] relative overflow-hidden rounded-2xl border border-border/40 glass-morphism animate-blur-in shadow-lg">
        {capturedImage ? (
          <div className="relative h-full w-full">
            <img 
              src={capturedImage} 
              alt="Captured medicine" 
              className="w-full h-full object-cover"
            />
            <button 
              onClick={resetCamera}
              className="absolute top-4 right-4 rounded-full bg-black/60 backdrop-blur-md p-2 text-white transition-all hover:bg-black/80"
              aria-label="Reset camera"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full bg-secondary/30 text-muted-foreground">
            <AlignCenter size={48} className="mb-4 text-muted-foreground/60" />
            <p className="text-sm max-w-[80%] text-center">Position medicine label in frame</p>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-center space-x-4">
        <button
          onClick={handleCapture}
          disabled={isCapturing}
          className={cn(
            "w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white shadow-lg transition-transform", 
            "hover:scale-105 active:scale-95",
            isCapturing && "opacity-50 cursor-not-allowed"
          )}
          aria-label="Take photo"
        >
          {isCapturing ? (
            <Loader2 size={24} className="animate-spin" />
          ) : (
            <CameraIcon size={24} />
          )}
        </button>
        
        <button
          onClick={triggerFileInput}
          disabled={isCapturing}
          className={cn(
            "w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary shadow-md transition-transform",
            "hover:scale-105 active:scale-95",
            isCapturing && "opacity-50 cursor-not-allowed"
          )}
          aria-label="Upload image"
        >
          <Image size={20} />
        </button>
      </div>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
    </div>
  );
};

export default Camera;
