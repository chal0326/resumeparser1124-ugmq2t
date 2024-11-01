export interface WorkHistory {
  id?: string;
  resume_id: string;
  job_title: string;
  company: string;
  start_date: string;
  end_date?: string;
}

export interface Responsibility {
  id?: string;
  work_history_id: string;
  description: string;
  skill: string;
}

export interface Resume {
  id?: string;
  content: string;
}