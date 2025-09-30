"use client";

import { useState } from 'react';
import CodeEditor from '@/components/editor/CodeEditor'; // Adjust path as needed

export default function ProblemPage({ params }) {
  // State management
  const [code, setCode] = useState('// Write your code here');
  const [language, setLanguage] = useState('javascript');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState(null); // Will store the full result object
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    setOutput(null);

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, input }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong');
      }
      
      setOutput(result);

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getOutputDetails = () => {
    if (!output) return null;

    // Status ID 3 is "Accepted"
    if (output.status.id === 3) {
      return (
        <pre className="p-2 bg-green-900 text-white rounded mt-4 whitespace-pre-wrap">{output.stdout || 'No output'}</pre>
      );
    }
    // Status ID 6 is "Compilation Error"
    if (output.status.id === 6) {
      return (
        <pre className="p-2 bg-red-900 text-white rounded mt-4 whitespace-pre-wrap">{output.compile_output}</pre>
      );
    }
    // Other statuses (e.g., Runtime Error, Time Limit Exceeded)
    return (
        <pre className="p-2 bg-red-900 text-white rounded mt-4 whitespace-pre-wrap">{output.stderr || 'An error occurred.'}</pre>
    );
  };


  return (
    <div className="p-8 font-sans">
      <h1 className="text-2xl font-bold mb-4">Problem: {params.slug}</h1>
      
      {/* Language Selector */}
      <div className="mb-4">
        <label htmlFor="language" className="block mb-2 font-medium">Language:</label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
        </select>
      </div>

      {/* Code Editor */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Source Code:</label>
        <CodeEditor code={code} setCode={setCode} language={language} />
      </div>

      {/* Standard Input */}
      <div className="mb-4">
        <label htmlFor="input" className="block mb-2 font-medium">Input (stdin):</label>
        <textarea
          id="input"
          rows="3"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-2 border rounded bg-gray-800 text-white"
          placeholder="Enter input for your code here..."
        ></textarea>
      </div>
      
      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-500"
      >
        {isLoading ? 'Executing...' : 'Run Code'}
      </button>

      {/* Output Section */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Output</h2>
        {error && <div className="p-2 bg-red-200 text-red-800 rounded">{error}</div>}
        {output && getOutputDetails()}
      </div>
    </div>
  );
}