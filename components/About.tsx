
import React from 'react';
import { Database, Code, BarChart2, Layers } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-10">
      <div className="text-center py-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">About This Project</h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          An advanced student performance analytics platform built to showcase modern web development and data science capabilities.
        </p>
      </div>

      {/* Tech Stack */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition">
          <div className="bg-blue-100 p-3 rounded-full w-fit mx-auto text-blue-600 mb-4"><Code size={24} /></div>
          <h3 className="font-bold text-gray-800">React & TypeScript</h3>
          <p className="text-sm text-gray-500 mt-2">Robust frontend architecture</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition">
          <div className="bg-purple-100 p-3 rounded-full w-fit mx-auto text-purple-600 mb-4"><Database size={24} /></div>
          <h3 className="font-bold text-gray-800">Data Processing</h3>
          <p className="text-sm text-gray-500 mt-2">Custom CSV parsing & cleaning</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition">
          <div className="bg-green-100 p-3 rounded-full w-fit mx-auto text-green-600 mb-4"><BarChart2 size={24} /></div>
          <h3 className="font-bold text-gray-800">Recharts</h3>
          <p className="text-sm text-gray-500 mt-2">Interactive data visualization</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition">
          <div className="bg-orange-100 p-3 rounded-full w-fit mx-auto text-orange-600 mb-4"><Layers size={24} /></div>
          <h3 className="font-bold text-gray-800">Google Gemini</h3>
          <p className="text-sm text-gray-500 mt-2">AI-powered insights</p>
        </div>
      </div>

      {/* Methodology Timeline */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Methodology</h2>
        <div className="relative border-l-2 border-gray-200 ml-4 space-y-10">
          <div className="relative pl-8">
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-600 border-4 border-white shadow-sm"></div>
            <h3 className="text-lg font-bold text-gray-800">1. Data Collection & Cleaning</h3>
            <p className="text-gray-600 mt-2 text-sm leading-relaxed">
              Loaded 500+ student records. Implemented deduplication logic to remove exact matches and sanitization steps to handle NaN values and ensure type safety (Int/Float casting).
            </p>
          </div>
          <div className="relative pl-8">
             <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-600 border-4 border-white shadow-sm"></div>
            <h3 className="text-lg font-bold text-gray-800">2. Exploratory Data Analysis (EDA)</h3>
            <p className="text-gray-600 mt-2 text-sm leading-relaxed">
              Calculated summary statistics (Mean, Median, Standard Deviation) and identified the "Top Predictor" using Pearson Correlation Coefficients between numerical features and Final Scores.
            </p>
          </div>
          <div className="relative pl-8">
             <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-600 border-4 border-white shadow-sm"></div>
            <h3 className="text-lg font-bold text-gray-800">3. Predictive Modeling</h3>
            <p className="text-gray-600 mt-2 text-sm leading-relaxed">
              Developed a client-side Linear Regression model (Normal Equation approximation) to predict Final Scores based on Study Hours, Attendance, and Past Scores. Calculated coefficients and R² values for transparency.
            </p>
          </div>
          <div className="relative pl-8">
             <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-green-500 border-4 border-white shadow-sm"></div>
            <h3 className="text-lg font-bold text-gray-800">4. Deployment</h3>
            <p className="text-gray-600 mt-2 text-sm leading-relaxed">
              Deployed as a responsive Single Page Application (SPA) with no external backend dependencies, ensuring portability and speed.
            </p>
          </div>
        </div>
      </div>
      
      <div className="text-center text-gray-400 text-sm py-4">
          Data Source: Synthetic educational dataset for demonstration purposes. Anonymized.
      </div>
    </div>
  );
};

export default About;
