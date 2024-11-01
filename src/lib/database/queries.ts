import { supabase } from '../supabase';
import type { Resume, WorkHistory, Responsibility } from '../../types';

export const insertResume = async (content: string, userId: string) => {
  return await supabase
    .from('resumes')
    .insert([{ content, user_id: userId }])
    .select()
    .single();
};

export const insertWorkHistory = async (workHistories: WorkHistory[]) => {
  return await supabase
    .from('work_history')
    .insert(workHistories)
    .select();
};

export const insertResponsibilities = async (responsibilities: Responsibility[]) => {
  return await supabase
    .from('responsibilities')
    .insert(responsibilities);
};