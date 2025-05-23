
import React from 'react';
import type { Prediction } from '../types';

interface PredictionResultDisplayProps {
  prediction: Prediction;
}

export const PredictionResultDisplay: React.FC<PredictionResultDisplayProps> = ({ prediction }) => {
  const isHighIncome = prediction.salaryCategory === '>50K';

  return (
    <div className="mt-8 p-6 bg-slate-700/50 shadow-lg rounded-xl border border-slate-600">
      <h2 className="text-2xl font-semibold mb-4 text-center text-sky-300">Prediction Result</h2>
      <div className="text-center mb-4">
        <p className="text-lg text-slate-300">Predicted Salary Category:</p>
        <p 
          className={`text-3xl font-bold my-2 px-4 py-2 inline-block rounded-md ${
            isHighIncome 
              ? 'bg-green-500/20 text-green-300 border border-green-400/50' 
              : 'bg-amber-500/20 text-amber-300 border border-amber-400/50'
          }`}
        >
          {prediction.salaryCategory}
        </p>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-semibold text-sky-400 mb-2">AI Generated Explanation:</h3>
        <p className="text-slate-300 text-sm leading-relaxed bg-slate-800 p-4 rounded-md border border-slate-700">
          {prediction.explanation}
        </p>
      </div>
    </div>
  );
};
    