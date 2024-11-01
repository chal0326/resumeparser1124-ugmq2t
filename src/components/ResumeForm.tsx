import React, { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';

interface ResumeFormProps {
  onSubmit: (text: string) => Promise<void>;
  isProcessing: boolean;
}

export default function ResumeForm({ onSubmit, isProcessing }: ResumeFormProps) {
  const [resumeText, setResumeText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(resumeText);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl">
        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          rows={12}
          className="block w-full rounded-xl border-0 px-4 py-4 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
          placeholder="Paste your resume text here..."
          required
        />
      </div>

      <button
        type="submit"
        disabled={isProcessing || !resumeText.trim()}
        className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Upload className="h-5 w-5" />
            Parse Resume
          </>
        )}
      </button>
    </form>
  );
}