import React, { useState } from 'react';
import ResumeParser from './components/ResumeParser';

function App() {
  const [error, setError] = useState<string | null>(null);

  // Check for required environment variables
  React.useEffect(() => {
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      setError('Missing Supabase configuration. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.');
    } else if (!import.meta.env.VITE_OPENAI_API_KEY) {
      setError('Missing OpenAI configuration. Please add VITE_OPENAI_API_KEY to your .env file.');
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
          <h1 className="text-red-600 text-xl font-semibold mb-4">Configuration Error</h1>
          <p className="text-gray-700">{error}</p>
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">Create a <code className="bg-gray-100 px-1 py-0.5 rounded">.env</code> file in your project root with:</p>
            <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
              VITE_SUPABASE_URL=your_supabase_url{'\n'}
              VITE_SUPABASE_ANON_KEY=your_supabase_anon_key{'\n'}
              VITE_OPENAI_API_KEY=your_openai_api_key
            </pre>
          </div>
        </div>
      </div>
    );
  }

  return <ResumeParser />;
}

export default App;