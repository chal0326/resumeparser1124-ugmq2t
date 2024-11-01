import React from 'react';

interface ResultMessageProps {
  success: boolean;
  message: string;
}

export default function ResultMessage({ success, message }: ResultMessageProps) {
  return (
    <div className={`mt-6 p-4 rounded-lg ${
      success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
    }`}>
      {message}
    </div>
  );
}