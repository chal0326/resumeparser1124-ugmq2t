import { supabase } from '../supabase';

const setupSchema = async () => {
  const { error: schemaError } = await supabase.from('resumes').select('id').limit(1);
  
  if (schemaError?.code === '42P01') { // Table doesn't exist
    const { error } = await supabase.rpc('create_schema', {
      schema_sql: `
        -- Enable UUID extension
        create extension if not exists "uuid-ossp";

        -- Create resumes table
        create table if not exists public.resumes (
          id uuid primary key default uuid_generate_v4(),
          content text not null,
          created_at timestamp with time zone default timezone('utc'::text, now()) not null
        );

        -- Create work_history table
        create table if not exists public.work_history (
          id uuid primary key default uuid_generate_v4(),
          resume_id uuid references public.resumes(id) on delete cascade,
          job_title text not null,
          company text not null,
          start_date text not null,
          end_date text,
          created_at timestamp with time zone default timezone('utc'::text, now()) not null
        );

        -- Create responsibilities table
        create table if not exists public.responsibilities (
          id uuid primary key default uuid_generate_v4(),
          work_history_id uuid references public.work_history(id) on delete cascade,
          description text not null,
          skill text not null,
          created_at timestamp with time zone default timezone('utc'::text, now()) not null
        );
      `
    });

    if (error) {
      console.error('Error creating schema:', error);
      return false;
    }
  }

  return true;
};

export const initializeDatabase = async () => {
  try {
    const success = await setupSchema();
    return success;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
};