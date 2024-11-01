import { supabase } from '../supabase';

export const initializeTables = async () => {
  try {
    const { data, error } = await supabase
      .from('resumes')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Error checking tables:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error checking tables:', error);
    return false;
  }
};