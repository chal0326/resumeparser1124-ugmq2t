import type { WorkHistory } from '../types';

export const parseWorkHistory = (text: string): WorkHistory[] => {
  const sections = text.split(/\n{2,}/);
  const workHistory: WorkHistory[] = [];
  
  let currentSection: WorkHistory | null = null;
  
  for (const section of sections) {
    const lines = section.trim().split('\n');
    const firstLine = lines[0].toLowerCase();
    
    if (firstLine.includes('experience') || firstLine.includes('work history')) {
      continue;
    }
    
    const titleCompanyMatch = lines[0].match(/^(.*?)\s*(?:at|,)\s*(.*)$/i);
    if (titleCompanyMatch) {
      if (currentSection) {
        workHistory.push(currentSection);
      }
      
      const dateMatch = lines[1]?.match(/(\w+ \d{4})\s*(?:-|to)\s*(\w+ \d{4}|Present)/i);
      currentSection = {
        resume_id: '', // Will be set after resume insertion
        job_title: titleCompanyMatch[1].trim(),
        company: titleCompanyMatch[2].trim(),
        start_date: dateMatch?.[1] || '',
        end_date: dateMatch?.[2] === 'Present' ? undefined : dateMatch?.[2]
      };
    }
  }
  
  if (currentSection) {
    workHistory.push(currentSection);
  }
  
  return workHistory;
};

export const parseResponsibilities = (text: string, workHistories: WorkHistory[]): Map<string, string[]> => {
  const responsibilitiesMap = new Map<string, string[]>();
  
  const sections = text.split(/\n{2,}/);
  let currentCompany = '';
  
  for (const section of sections) {
    const lines = section.trim().split('\n');
    const firstLine = lines[0];
    
    const titleCompanyMatch = firstLine.match(/^(.*?)\s*(?:at|,)\s*(.*)$/i);
    if (titleCompanyMatch) {
      currentCompany = titleCompanyMatch[2].trim();
      continue;
    }
    
    if (currentCompany) {
      const bullets = lines.filter(line => line.trim().startsWith('•') || line.trim().startsWith('-'));
      if (bullets.length > 0) {
        const workHistory = workHistories.find(wh => wh.company === currentCompany);
        if (workHistory) {
          responsibilitiesMap.set(currentCompany, bullets.map(b => b.replace(/^[•-]\s*/, '')));
        }
      }
    }
  }
  
  return responsibilitiesMap;
};