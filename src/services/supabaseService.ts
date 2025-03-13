
import { createClient } from '@supabase/supabase-js';
import { MedicineInfo } from '@/components/MedicineResult';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase credentials are missing');
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '');

// Save medicine data to Supabase
export const saveMedicineData = async (medicine: MedicineInfo): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('medicines')
      .insert([
        {
          name: medicine.name,
          description: medicine.description,
          ingredients: medicine.ingredients,
          price: medicine.price,
          availability: medicine.availability,
          precautions: medicine.precautions,
          alternatives: medicine.alternatives,
          scanned_at: new Date()
        }
      ]);

    if (error) {
      console.error('Error saving to Supabase:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Supabase service error:', error);
    return false;
  }
};

// Get all scanned medicines
export const getScannedMedicines = async (): Promise<MedicineInfo[]> => {
  try {
    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .order('scanned_at', { ascending: false });

    if (error) {
      console.error('Error fetching from Supabase:', error);
      return [];
    }

    return data as MedicineInfo[];
  } catch (error) {
    console.error('Supabase service error:', error);
    return [];
  }
};
