import React, { useState, useCallback } from 'react';
import { SalaryPredictionForm } from './components/SalaryPredictionForm';
import { PredictionResultDisplay } from './components/PredictionResultDisplay';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { predictSalaryWithFastAPI } from './services/fastAPIService'; // Changed import
import type { FormData, Prediction } from './types';
import { INITIAL_FORM_DATA } from './constants';

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = useCallback(async (currentFormData: FormData) => {
    setIsLoading(true);
    setError(null);
    setPrediction(null);
    try {
      // Use the new FastAPI service
      const result = await predictSalaryWithFastAPI(currentFormData);
      setPrediction(result);
    } catch (err) {
      console.error("Error predicting salary with FastAPI:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred connecting to the backend. Make sure your FastAPI server is running and check console for details.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleFormChange = useCallback((newFormData: FormData) => {
    setFormData(newFormData);
  }, []);


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 selection:bg-sky-500 selection:text-white">
      <header className="mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">
          AI Salary Predictor
        </h1>
        <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-xl">
          Enter demographic and employment details to get a salary prediction ({'>'}50K or &lt;=50K) from your FastAI model.
        </p>
      </header>

      <main className="w-full max-w-2xl bg-slate-800 shadow-2xl rounded-xl p-6 sm:p-8">
        <SalaryPredictionForm
          initialData={formData}
          onSubmit={handleFormSubmit}
          onFormChange={handleFormChange}
          isLoading={isLoading}
        />

        {isLoading && (
          <div className="mt-8 flex flex-col items-center justify-center">
            <LoadingSpinner />
            <p className="text-sky-400 mt-2">Getting prediction from your model...</p>
          </div>
        )}

        {error && (
          <div className="mt-8 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-300 text-center">
            <h3 className="font-semibold mb-1">Prediction Error</h3>
            <p className="text-sm">{error}</p>
            <p className="text-xs mt-2">Ensure your FastAPI backend server is running and accessible.</p>
          </div>
        )}

        {prediction && !isLoading && (
          <PredictionResultDisplay prediction={prediction} />
        )}
      </main>

      <footer className="mt-12 text-center text-slate-500 text-xs">
        <p>&copy; {new Date().getFullYear()} AI Salary Predictor. Powered by your FastAI model.</p>
        <p>FastAPI Backend + React Frontend.</p>
      </footer>
    </div>
  );
};

export default App;