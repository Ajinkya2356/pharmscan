
import { createWorker } from 'tesseract.js';
import { toast } from '@/components/ui/use-toast';

export const recognizeText = async (imageUrl: string): Promise<string> => {
  try {
    const worker = await createWorker('eng');
    const result = await worker.recognize(imageUrl);
    await worker.terminate();
    return result.data.text;
  } catch (error) {
    console.error('OCR error:', error);
    toast({
      title: 'OCR Error',
      description: 'Failed to extract text from image',
      variant: 'destructive',
    });
    return '';
  }
};
