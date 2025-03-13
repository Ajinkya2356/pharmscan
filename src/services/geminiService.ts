
import { MedicineInfo } from '@/components/MedicineResult';
import { toast } from '@/components/ui/use-toast';

type GeminiAnalysisResult = {
  success: boolean;
  data: MedicineInfo | null;
  message: string;
};

export const analyzeMedicineImage = async (imageData: string): Promise<GeminiAnalysisResult> => {
  try {
    // Get API key from environment variable
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      console.warn('Gemini API key is missing. Using mock data for testing.');
      
      // Return mock data if API key is missing
      return {
        success: true,
        data: {
          isImageClear: true,
          name: "Sample Medicine (Demo Mode)",
          description: "This is a placeholder result since the Gemini API key is not configured.",
          ingredients: ["Demo Ingredient 1", "Demo Ingredient 2"],
          price: "$10-15",
          availability: "Available at most pharmacies",
          precautions: ["Keep out of reach of children", "Store in a cool, dry place"],
          alternatives: ["Alternative Medicine A", "Alternative Medicine B"]
        },
        message: 'Successfully analyzed medicine image (demo mode)'
      };
    }

    // Convert base64 image to proper format for Gemini
    // Remove data:image/jpeg;base64, or similar prefix if present
    const base64Image = imageData.includes('base64,') 
      ? imageData.split('base64,')[1] 
      : imageData;

    // Prepare the prompt for Gemini
    const prompt = `
      Analyze this medicine package or label image. 
      First, check if the image is clear enough to read the text. If not, respond with a JSON object where "isImageClear" is false.
      
      If the image is clear, extract and return the following information in JSON format:
      {
        "isImageClear": true,
        "name": "Medicine name",
        "description": "Medicine description/purpose",
        "ingredients": ["ingredient1", "ingredient2"],
        "price": "Price or price range",
        "availability": "Availability information",
        "precautions": ["precaution1", "precaution2"],
        "alternatives": ["alternative1", "alternative2"]
      }
      
      Only return valid JSON. No commentary or explanation.
    `;

    // Make API call to Gemini
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: base64Image
                }
              }
            ]
          }
        ],
        generation_config: {
          temperature: 0.2,
          top_p: 0.8,
          top_k: 40,
          max_output_tokens: 1024,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.candidates[0].content.parts[0].text;
    
    // Extract JSON from response
    try {
      const result = JSON.parse(content);
      
      if (!result.isImageClear) {
        return {
          success: false,
          data: null,
          message: 'The image is not clear enough. Please take another photo with better lighting and focus on the medicine label.'
        };
      }
      
      return {
        success: true,
        data: result as MedicineInfo,
        message: 'Successfully analyzed medicine image'
      };
    } catch (e) {
      console.error('Failed to parse Gemini response as JSON:', e);
      return {
        success: false,
        data: null,
        message: 'Failed to analyze the medicine. The LLM response was not properly formatted.'
      };
    }
  } catch (error) {
    console.error('Gemini service error:', error);
    return {
      success: false,
      data: null,
      message: 'An error occurred while analyzing the medicine image.'
    };
  }
};
