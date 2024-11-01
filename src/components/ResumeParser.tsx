import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { extractSkill } from '../lib/openai';
import type { WorkHistory, Responsibility } from '../types';
import ResumeForm from './ResumeForm';
import ResultMessage from './ResultMessage';
import { parseWorkHistory, parseResponsibilities } from '../utils/parser';

export default function ResumeParser() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleSubmit = async (resumeText: string) => {
    setIsProcessing(true);
    setResult(null);
    
    try {
      // 1. Insert resume
      const { data: resumeData, error: resumeError } = await supabase
        .from('resumes')
        .insert([{ content: resumeText }])
        .select()
        .single();
        
      if (resumeError) throw resumeError;
      
      // 2. Parse and insert work history
      const workHistories = parseWorkHistory(resumeText);
      for (const history of workHistories) {
        history.resume_id = resumeData.id;
      }
      
      const { data: workHistoryData, error: workHistoryError } = await supabase
        .from('work_history')
        .insert(workHistories)
        .select();
        
      if (workHistoryError) throw workHistoryError;
      
      // 3. Parse responsibilities and extract skills
      const responsibilitiesMap = parseResponsibilities(resumeText, workHistories);
      const responsibilities: Responsibility[] = [];
      
      for (const [company, bullets] of responsibilitiesMap.entries()) {
        const workHistory = workHistoryData.find(wh => wh.company === company);
        if (workHistory) {
          for (const bullet of bullets) {
            const skill = await extractSkill(bullet);
            responsibilities.push({
              work_history_id: workHistory.id,
              description: bullet,
              skill
            });
          }
        }
      }
      
      const { error: responsibilitiesError } = await supabase
        .from('responsibilities')
        .insert(responsibilities);
        
      if (responsibilitiesError) throw responsibilitiesError;
      
      setResult({
        success: true,
        message: 'Resume successfully parsed and stored!'
      });
    } catch (error) {
      console.error('Error processing resume:', error);
      setResult({
        success: false,
        message: 'Error processing resume. Please try again.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <FileText className="mx-auto h-12 w-12 text-indigo-600" />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
            Resume Parser
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Paste your resume text below to extract and structure your work history
          </p>
        </div>

        <ResumeForm onSubmit={handleSubmit} isProcessing={isProcessing} />
        
        {result && (
          <ResultMessage success={result.success} message={result.message} />
        )}
      </div>
    </div>
  );
}