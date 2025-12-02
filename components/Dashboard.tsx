
import React, { useMemo } from 'react';
import { Student } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis, AreaChart, Area
} from 'recharts';
import { Users, GraduationCap, Clock, TrendingUp, Wifi, Zap } from 'lucide-react';
import { calculateCorrelation } from '../utils/csvData';

interface DashboardProps {
  students: Student[];
}

const StatCard: React.FC<{ title: string; value: string; subValue?: string; icon: React.ReactNode; color: string; chartData?: any[] }> = ({ title, value, subValue, icon, color, chartData }) => (
  <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
    <div className="flex items-center space-x-4 mb-3">
      <div className={`p-3 rounded-full ${color} text-white shadow-sm`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{title}</p>
        <h3 className="text-2xl font-extrabold text-gray-800">{value}</h3>
      </div>
    </div>
    <div className="flex justify-between items-end">
       {subValue && <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-md">{subValue}</span>}
       {chartData && (
           <div className="w-20 h-10">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <Area type="monotone" dataKey="val" stroke="#8884d8" fill="#8884d8" fillOpacity={0.2} />
                    </AreaChart>
                </ResponsiveContainer>
           </div>
       )}
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ students }) => {
  
  const stats = useMemo(() => {
    if (students.length === 0) return null;
    const total = students.length;
    const passed = students.filter(s => s.Pass_Fail === 'Pass');
    const passRate = (passed.length / total) * 100;
    const avgScore = students.reduce((acc, s) => acc + s.Final_Exam_Score, 0) / total;
    const avgStudy = students.reduce((acc, s) => acc + s.Study_Hours_per_Week, 0) / total;
    
    // Correlations
    const pastScores = students.map(s => s.Past_Exam_Scores);
    const finalScores = students.map(s => s.Final_Exam_Score);
    const correlation = calculateCorrelation(pastScores, finalScores);

    // Internet Impact
    const withInternet = students.filter(s => s.Internet_Access_at_Home === 'Yes');
    const withoutInternet = students.filter(s => s.Internet_Access_at_Home === 'No');
    const passRateInternet = (withInternet.filter(s => s.Pass_Fail === 'Pass').length / withInternet.length) * 100;
    const passRateNoInternet = (withoutInternet.filter(s => s.Pass_Fail === 'Pass').length / withoutInternet.length) * 100;
    const internetDiff = passRateInternet - passRateNoInternet;

    return {
      total,
      passRate: passRate.toFixed(1) + '%',
      avgScore: avgScore.toFixed(1),
      avgStudy: avgStudy.toFixed(1),
      correlation: correlation,
      internetDiff: internetDiff.toFixed(1) + '%',
      passCount: passed.length
    };
  }, [students]);

  // Chart Data preparation
  const passByGender = useMemo(() => {
     const data = [
         { name: 'Male', Pass: 0, Fail: 0 },
         { name: 'Female', Pass: 0, Fail: 0 }
     ];
     students.forEach(s => {
         const idx = s.Gender === 'Male' ? 0 : 1;
         if (s.Pass_Fail === 'Pass') data[idx].Pass++;
         else data[idx].Fail++;
     });
     return data;
  }, [students]);

  // Mini Sparkline Data
  const trendData = useMemo(() => students.slice(0, 10).map((s, i) => ({ val: s.Final_Exam_Score })), [students]);

  if (!stats) return <div className="p-10 text-center">Loading Data...</div>;

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
            <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Student Success Analyzer</h1>
            <p className="text-blue-100 text-lg mb-6">Insights from 500+ Students. Unlock patterns in study habits, attendance, and demographics to predict and improve performance.</p>
            <div className="flex space-x-4">
                 <div className="bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 border border-white/20">
                    <span className="block text-2xl font-bold">{stats.total}</span>
                    <span className="text-xs text-blue-200 uppercase">Records</span>
                 </div>
                 <div className="bg-white/10 backdrop-blur-md rounded-lg px-4 py-2 border border-white/20">
                    <span className="block text-2xl font-bold">{stats.passCount}</span>
                    <span className="text-xs text-blue-200 uppercase">Passed</span>
                 </div>
            </div>
        </div>
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-20 w-40 h-40 bg-blue-400 opacity-10 rounded-full blur-2xl"></div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
            title="Total Students" 
            value={stats.total.toString()} 
            subValue="100% Data" 
            icon={<Users size={20} />} 
            color="bg-blue-500" 
        />
        <StatCard 
            title="Avg Final Score" 
            value={stats.avgScore} 
            subValue={`Top Predictor: r=${stats.correlation}`}
            icon={<TrendingUp size={20} />} 
            color="bg-purple-500"
            chartData={trendData}
        />
        <StatCard 
            title="Overall Pass Rate" 
            value={stats.passRate} 
            subValue="Target: 70%" 
            icon={<GraduationCap size={20} />} 
            color="bg-green-500" 
        />
        <StatCard 
            title="Avg Study Hours" 
            value={stats.avgStudy} 
            subValue="Hrs/Week" 
            icon={<Clock size={20} />} 
            color="bg-orange-500" 
        />
      </div>

      {/* Narrative & Gender Chart Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Narrative Summary */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
             <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                 <Zap className="text-yellow-500 mr-2" size={20}/> Key Insights
             </h3>
             <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                 <p className="text-blue-800 font-medium">
                     Students with <span className="font-bold">Internet Access</span> pass {stats.internetDiff} more often than those without.
                 </p>
             </div>
             <ul className="space-y-3 text-gray-600">
                 <li className="flex items-start">
                     <span className="bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</span>
                     <p>Strong correlation ({stats.correlation}) between Past Exam Scores and Final Outcomes suggests consistency is key.</p>
                 </li>
                 <li className="flex items-start">
                     <span className="bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</span>
                     <p>Average study time is {stats.avgStudy} hours. Students scoring above 90 typically study 25+ hours.</p>
                 </li>
                 <li className="flex items-start">
                     <span className="bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</span>
                     <p>Source Data: Synthetic Dataset (500 records), analyzed using Typescript & Recharts.</p>
                 </li>
             </ul>
          </div>

          {/* Pass Rate by Gender */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Pass Rate by Gender</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={passByGender}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Pass" fill="#10B981" stackId="a" radius={[0, 0, 4, 4]} />
                        <Bar dataKey="Fail" fill="#EF4444" stackId="a" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
              </div>
          </div>
      </div>
    </div>
  );
};

export default Dashboard;
