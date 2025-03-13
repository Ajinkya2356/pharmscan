
import { MedicineInfo } from '@/components/MedicineResult';

export const analyzeMedicineText = async (text: string): Promise<MedicineInfo | null> => {
  try {
    // Get API key from environment variable
    const apiKey = import.meta.env.VITE_LLM_API_KEY;
    
    if (!apiKey) {
      console.error('LLM API key is missing');
      return null;
    }

    // Prepare the prompt for the LLM
    const prompt = `
      Analyze this text from a medicine package and extract the following information:
      
      Text from image: "${text}"
      
      Please return ONLY JSON with the following structure:
      {
        "name": "Medicine name",
        "description": "Medicine description/purpose",
        "ingredients": ["ingredient1", "ingredient2"],
        "price": "Price or price range",
        "availability": "Availability information",
        "precautions": ["precaution1", "precaution2"],
        "alternatives": ["alternative1", "alternative2"]
      }
    `;

    // Make API call to LLM service
    // This example uses OpenAI, but you can replace with any LLM API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`LLM API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Extract JSON from response
    try {
      return JSON.parse(content);
    } catch (e) {
      console.error('Failed to parse LLM response as JSON:', e);
      return null;
    }
  } catch (error) {
    console.error('LLM service error:', error);
    return null;
  }
};
