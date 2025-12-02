import React, { useState } from 'react';
import { predictOutcome } from '../services/geminiService';
import { Brain, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { Student } from '../types';

const Predictor: React.FC = () => {
  const [formData, setFormData] = useState({
    Study_Hours_per_Week: 20,
    Attendance_Rate: 85,
    Past_Exam_Scores: 75,
    Parental_Education_Level: 'High School',
    Internet_Access_at_Home: 'Yes',
    Extracurricular_Activities: 'No'
  });

  const [result, setResult] = useState<{ prediction: string; confidence: string; reasoning: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePredict = async () => {
    setLoading(true);
    setResult(null);
    // Cast formData to Partial<Student> as form state uses strings but service expects specific types
    const prediction = await predictOutcome(formData as unknown as Partial<Student>);
    setResult(prediction);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-indigo-600 p-6 text-white">
          <h2 className="text-2xl font-bold flex items-center">
            <Brain className="mr-3" /> Student Success Predictor
          </h2>
          <p className="text-indigo-100 mt-2">
            Enter student details below to simulate a Pass/Fail prediction using our AI model.
          </p>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-700 mb-4">Input Parameters</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Study Hours per Week</label>
              <input 
                type="number" 
                name="Study_Hours_per_Week"
                value={formData.Study_Hours_per_Week}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Attendance Rate (%)</label>
              <input 
                type="range" 
                min="0" max="100"
                name="Attendance_Rate"
                value={formData.Attendance_Rate}
                onChange={handleChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-right text-sm text-gray-500 mt-1">{formData.Attendance_Rate}%</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Past Exam Scores (0-100)</label>
              <input 
                type="number" 
                name="Past_Exam_Scores"
                value={formData.Past_Exam_Scores}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Parental Education</label>
              <select 
                name="Parental_Education_Level"
                value={formData.Parental_Education_Level}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="High School">High School</option>
                <option value="Bachelors">Bachelors</option>
                <option value="Masters">Masters</option>
                <option value="PhD">PhD</option>
              </select>
            </div>
            
             <button 
                onClick={handlePredict}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition flex items-center justify-center mt-6"
              >
                {loading ? 'Analyzing...' : 'Predict Outcome'}
                {!loading && <ArrowRight className="ml-2" size={18} />}
              </button>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 flex flex-col justify-center items-center text-center">
            {!result && !loading && (
              <div className="text-gray-400">
                <Brain size={48} className="mx-auto mb-4 opacity-20" />
                <p>Fill out the form and hit Predict to see the AI analysis results.</p>
              </div>
            )}

            {loading && (
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            )}

            {result && (
              <div className="w-full animate-fade-in">
                <div className="mb-4">
                  <span className="text-sm uppercase tracking-wide text-gray-500 font-semibold">Prediction</span>
                  <div className={`text-4xl font-extrabold mt-2 flex items-center justify-center ${
                    result.prediction === 'Pass' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {result.prediction === 'Pass' ? <CheckCircle size={32} className="mr-2" /> : <XCircle size={32} className="mr-2" />}
                    {result.prediction}
                  </div>
                </div>
                
                <div className="mb-6">
                   <span className="text-xs uppercase tracking-wide text-gray-400 font-semibold">Confidence</span>
                   <div className="mt-1 font-medium text-gray-700">{result.confidence}</div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 text-left">
                  <span className="text-xs uppercase tracking-wide text-gray-400 font-semibold block mb-2">AI Reasoning</span>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {result.reasoning}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Predictor;