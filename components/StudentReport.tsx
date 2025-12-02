
import React, { useState, useMemo, useEffect } from 'react';
import { Student } from '../types';
import { performRegression, getPercentile } from '../utils/csvData';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, Tooltip as RechartsTooltip, Cell
} from 'recharts';
import { Search, Download, Calculator, TrendingUp, AlertCircle } from 'lucide-react';

interface StudentReportProps {
  students: Student[];
}

const StudentReport: React.FC<StudentReportProps> = ({ students }) => {
  const [selectedId, setSelectedId] = useState<string>('');
  const [query, setQuery] = useState('');
  const [simStudy, setSimStudy] = useState(0);
  const [simAttd, setSimAttd] = useState(0);

  // Default to first student if available
  useEffect(() => {
      if (students.length > 0 && !selectedId) {
          setSelectedId(students[0].Student_ID);
          setSimStudy(students[0].Study_Hours_per_Week);
          setSimAttd(students[0].Attendance_Rate);
      }
  }, [students]);

  const student = useMemo(() => students.find(s => s.Student_ID === selectedId), [students, selectedId]);

  // Model training (happens once effectively due to memo)
  const model = useMemo(() => performRegression(students), [students]);

  // Handle Search
  const filteredIds = useMemo(() => {
      if (!query) return [];
      return students
        .filter(s => s.Student_ID.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5);
  }, [students, query]);

  const handleSelect = (id: string) => {
      setSelectedId(id);
      setQuery('');
      const s = students.find(x => x.Student_ID === id);
      if (s) {
          setSimStudy(s.Study_Hours_per_Week);
          setSimAttd(s.Attendance_Rate);
      }
  };

  // Calculations for Report
  const reportData = useMemo(() => {
      if (!student) return null;
      
      const scorePercentile = getPercentile(student.Final_Exam_Score, students.map(s => s.Final_Exam_Score).sort((a,b)=>a-b));
      const studyPercentile = getPercentile(student.Study_Hours_per_Week, students.map(s => s.Study_Hours_per_Week).sort((a,b)=>a-b));

      // Radar Data (Normalized 0-100 approx)
      const radarData = [
          { subject: 'Study Hrs', A: (student.Study_Hours_per_Week / 40) * 100, fullMark: 100 },
          { subject: 'Attendance', A: student.Attendance_Rate, fullMark: 100 },
          { subject: 'Past Score', A: student.Past_Exam_Scores, fullMark: 100 },
          { subject: 'Final Score', A: student.Final_Exam_Score, fullMark: 100 },
      ];

      // Prediction for Simulator
      // Equation: Score = Intercept + b1*Study + b2*Attd + b3*Past
      const predictedOriginal = model.intercept + 
          model.coefficients['Study Hours'] * student.Study_Hours_per_Week +
          model.coefficients['Attendance'] * student.Attendance_Rate +
          model.coefficients['Past Scores'] * student.Past_Exam_Scores;

      const predictedSim = model.intercept + 
          model.coefficients['Study Hours'] * simStudy +
          model.coefficients['Attendance'] * simAttd +
          model.coefficients['Past Scores'] * student.Past_Exam_Scores;
      
      const improvement = predictedSim - predictedOriginal;

      return {
          scorePercentile,
          studyPercentile,
          radarData,
          predictedSim: Math.min(100, Math.max(0, predictedSim)).toFixed(1),
          improvement: improvement.toFixed(1)
      };
  }, [student, students, model, simStudy, simAttd]);

  if (!student || !reportData) return <div>Select a student</div>;

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
        
        {/* Search Bar */}
        <div className="relative z-20">
             <div className="flex items-center space-x-2 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                 <Search className="text-gray-400" />
                 <input 
                    type="text" 
                    placeholder="Search Student ID (e.g. S147)..." 
                    className="flex-1 outline-none text-gray-700"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                 />
                 <button onClick={() => window.print()} className="flex items-center space-x-2 text-sm text-blue-600 font-medium hover:bg-blue-50 px-3 py-1 rounded-md transition">
                     <Download size={16} /> <span>Export PDF</span>
                 </button>
             </div>
             {filteredIds.length > 0 && (
                 <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg mt-2 overflow-hidden">
                     {filteredIds.map(s => (
                         <div 
                            key={s.Student_ID} 
                            onClick={() => handleSelect(s.Student_ID)}
                            className="p-3 hover:bg-blue-50 cursor-pointer flex justify-between"
                         >
                             <span className="font-medium">{s.Student_ID}</span>
                             <span className="text-gray-400 text-sm">{s.Pass_Fail}</span>
                         </div>
                     ))}
                 </div>
             )}
        </div>

        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
             <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white flex justify-between items-center">
                 <div>
                     <h2 className="text-3xl font-bold">{student.Student_ID} Report</h2>
                     <p className="opacity-80 mt-1">{student.Gender} • {student.Parental_Education_Level} • Internet: {student.Internet_Access_at_Home}</p>
                 </div>
                 <div className={`px-6 py-2 rounded-full font-bold text-xl bg-white ${student.Pass_Fail === 'Pass' ? 'text-green-600' : 'text-red-600'}`}>
                     {student.Pass_Fail.toUpperCase()}
                 </div>
             </div>
             
             <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100 border-b border-gray-100">
                 <div className="p-6 text-center">
                     <div className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Final Score</div>
                     <div className="text-3xl font-bold text-gray-800 mt-2">{student.Final_Exam_Score}</div>
                     <div className="text-xs text-blue-500 font-medium mt-1">Top {100 - reportData.scorePercentile}%</div>
                 </div>
                 <div className="p-6 text-center">
                     <div className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Study Hours</div>
                     <div className="text-3xl font-bold text-gray-800 mt-2">{student.Study_Hours_per_Week}</div>
                     <div className="text-xs text-gray-500 font-medium mt-1">Percentile: {reportData.studyPercentile}th</div>
                 </div>
                 <div className="p-6 text-center">
                     <div className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Attendance</div>
                     <div className="text-3xl font-bold text-gray-800 mt-2">{student.Attendance_Rate}%</div>
                 </div>
                 <div className="p-6 text-center">
                     <div className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Past Avg</div>
                     <div className="text-3xl font-bold text-gray-800 mt-2">{student.Past_Exam_Scores}</div>
                 </div>
             </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Simulator & Model */}
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                 <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                     <Calculator className="mr-2 text-indigo-500" /> "What-if" Simulator
                 </h3>
                 <p className="text-sm text-gray-500 mb-6">Adjust study habits to see predicted impact on final score based on our Linear Regression model.</p>
                 
                 <div className="space-y-6">
                     <div>
                         <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                             <span>Study Hours / Week</span>
                             <span className="text-indigo-600 font-bold">{simStudy} hrs</span>
                         </label>
                         <input 
                            type="range" min="0" max="40" 
                            value={simStudy} 
                            onChange={(e) => setSimStudy(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                         />
                     </div>
                     <div>
                         <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                             <span>Attendance Rate</span>
                             <span className="text-indigo-600 font-bold">{simAttd}%</span>
                         </label>
                         <input 
                            type="range" min="50" max="100" 
                            value={simAttd} 
                            onChange={(e) => setSimAttd(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                         />
                     </div>
                 </div>

                 <div className="mt-8 p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex justify-between items-center">
                     <div>
                         <div className="text-indigo-800 font-semibold">Predicted Score</div>
                         <div className="text-xs text-indigo-400 font-mono mt-1">{model.equation}</div>
                     </div>
                     <div className="text-right">
                         <div className="text-3xl font-bold text-indigo-900">{reportData.predictedSim}</div>
                         <div className={`text-sm font-bold ${Number(reportData.improvement) >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                             {Number(reportData.improvement) > 0 ? '+' : ''}{reportData.improvement} pts
                         </div>
                     </div>
                 </div>
             </div>

             {/* Radar & Recommendations */}
             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col">
                 <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                     <TrendingUp className="mr-2 text-green-500" /> Performance Radar
                 </h3>
                 <div className="flex-1 min-h-[250px]">
                     <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={reportData.radarData}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} />
                            <Radar name={student.Student_ID} dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                            <RechartsTooltip />
                        </RadarChart>
                     </ResponsiveContainer>
                 </div>
                 
                 <div className="mt-4 border-t border-gray-100 pt-4">
                     <h4 className="text-sm font-bold text-gray-700 mb-2 flex items-center">
                         <AlertCircle size={16} className="mr-2 text-orange-500" /> Recommendations
                     </h4>
                     <ul className="text-sm text-gray-600 space-y-2">
                         {student.Study_Hours_per_Week < 20 && (
                             <li className="flex items-start">• <span className="ml-2">Increase study time to at least 25 hours/week.</span></li>
                         )}
                         {student.Attendance_Rate < 75 && (
                             <li className="flex items-start">• <span className="ml-2">Attendance is critical. Aim for >90% to boost reliability.</span></li>
                         )}
                         {student.Past_Exam_Scores < 70 && (
                             <li className="flex items-start">• <span className="ml-2">Review past exam mistakes to improve fundamentals.</span></li>
                         )}
                         {student.Study_Hours_per_Week >= 20 && student.Attendance_Rate >= 80 && (
                             <li className="flex items-start">• <span className="ml-2">You are on the right track! Maintain your consistency.</span></li>
                         )}
                     </ul>
                 </div>
             </div>
        </div>
    </div>
  );
};

export default StudentReport;
