
import { createClient } from '@supabase/supabase-js';
import { MedicineInfo } from '@/components/MedicineResult';

export const saveMedicineData = async (medicine: MedicineInfo) => {
  try {
    // Get Supabase credentials from environment variables
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.warn('Supabase credentials are missing. Data will not be saved.');
      return { success: false, message: 'Supabase credentials are missing' };
    }
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Save data to Supabase
    const { data, error } = await supabase
      .from('medicine_scans')
      .insert([
        {
          name: medicine.name,
          description: medicine.description,
          ingredients: medicine.ingredients,
          price: medicine.price,
          availability: medicine.availability,
          precautions: medicine.precautions,
          alternatives: medicine.alternatives,
          scanned_at: new Date().toISOString()
        }
      ]);
    
    if (error) {
      console.error('Error saving to Supabase:', error);
      return { success: false, message: error.message };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Supabase service error:', error);
    return { success: false, message: 'Failed to save data to database' };
  }
};
