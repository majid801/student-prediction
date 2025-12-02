
import React, { useState, useMemo } from 'react';
import { Student } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  ScatterChart, Scatter, ZAxis, ComposedChart, Line
} from 'recharts';
import { calculateCorrelation } from '../utils/csvData';

interface VisualizationsProps {
  students: Student[];
}

const Visualizations: React.FC<VisualizationsProps> = ({ students }) => {
  const [activeTab, setActiveTab] = useState<'correlations' | 'distributions' | 'comparisons'>('correlations');

  const correlationMatrix = useMemo(() => {
    const keys = ['Study_Hours_per_Week', 'Attendance_Rate', 'Past_Exam_Scores', 'Final_Exam_Score'];
    const labels = ['Study Hrs', 'Attendance', 'Past Score', 'Final Score'];
    const matrix = [];

    for (let i = 0; i < keys.length; i++) {
        const row = [];
        for (let j = 0; j < keys.length; j++) {
            // @ts-ignore
            const val = calculateCorrelation(students.map(s => s[keys[i]]), students.map(s => s[keys[j]]));
            row.push(val);
        }
        matrix.push({ label: labels[i], values: row });
    }
    return { labels, matrix };
  }, [students]);

  const scatterData = useMemo(() => students.map(s => ({
      x: s.Past_Exam_Scores,
      y: s.Final_Exam_Score,
      z: s.Study_Hours_per_Week,
      status: s.Pass_Fail
  })), [students]);

  const comparisonData = useMemo(() => {
      const groups = ['High School', 'Bachelors', 'Masters', 'PhD'];
      return groups.map(edu => {
          const subset = students.filter(s => s.Parental_Education_Level === edu);
          const pass = subset.filter(s => s.Pass_Fail === 'Pass').length;
          const fail = subset.length - pass;
          return { name: edu, Pass: pass, Fail: fail };
      });
  }, [students]);

  const boxPlotData = useMemo(() => {
      // Approximate distribution for "Box Plot" view using bar ranges or similar
      const passHours = students.filter(s => s.Pass_Fail === 'Pass').map(s => s.Study_Hours_per_Week);
      const failHours = students.filter(s => s.Pass_Fail === 'Fail').map(s => s.Study_Hours_per_Week);
      
      const avgPass = passHours.reduce((a,b)=>a+b,0)/passHours.length;
      const avgFail = failHours.reduce((a,b)=>a+b,0)/failHours.length;

      return [
          { name: 'Pass', avg: avgPass, min: Math.min(...passHours), max: Math.max(...passHours) },
          { name: 'Fail', avg: avgFail, min: Math.min(...failHours), max: Math.max(...failHours) }
      ];
  }, [students]);

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="flex space-x-4 bg-white p-2 rounded-xl border border-gray-200 shadow-sm w-fit">
            {(['correlations', 'distributions', 'comparisons'] as const).map(tab => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                        activeTab === tab ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'
                    }`}
                >
                    {tab}
                </button>
            ))}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[500px]">
            {activeTab === 'correlations' && (
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-800">Correlation Matrix Heatmap</h3>
                    <p className="text-gray-500 text-sm">Darker blue indicates a stronger positive relationship. 1.0 is a perfect match.</p>
                    
                    <div className="overflow-x-auto">
                        <div className="grid grid-cols-5 gap-1 max-w-2xl mx-auto">
                            <div className="col-span-1"></div>
                            {correlationMatrix.labels.map((l, i) => (
                                <div key={i} className="font-bold text-center text-xs text-gray-600 p-2 uppercase">{l}</div>
                            ))}

                            {correlationMatrix.matrix.map((row, i) => (
                                <React.Fragment key={i}>
                                    <div className="font-bold text-right text-xs text-gray-600 p-2 uppercase flex items-center justify-end">{row.label}</div>
                                    {row.values.map((val, j) => {
                                        const intensity = Math.abs(val);
                                        const bg = val > 0 ? `rgba(59, 130, 246, ${intensity})` : `rgba(239, 68, 68, ${intensity})`;
                                        const textCol = intensity > 0.5 ? 'white' : 'black';
                                        return (
                                            <div key={j} className="h-16 flex items-center justify-center rounded-md border border-gray-50 transition hover:scale-105" style={{ backgroundColor: bg, color: textCol }}>
                                                <span className="font-mono font-medium">{val.toFixed(2)}</span>
                                            </div>
                                        )
                                    })}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'distributions' && (
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-800">Past vs Final Scores (Sized by Study Hours)</h3>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid />
                                <XAxis type="number" dataKey="x" name="Past Score" unit="" />
                                <YAxis type="number" dataKey="y" name="Final Score" unit="" />
                                <ZAxis type="number" dataKey="z" range={[50, 400]} name="Study Hours" />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ payload }) => {
                                    if (payload && payload.length) {
                                        const data = payload[0].payload;
                                        return (
                                            <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg text-sm">
                                                <p className="font-bold mb-1">Student Data</p>
                                                <p>Past: {data.x}</p>
                                                <p>Final: {data.y}</p>
                                                <p>Study: {data.z} hrs</p>
                                                <p className={data.status === 'Pass' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>{data.status}</p>
                                            </div>
                                        )
                                    }
                                    return null;
                                }} />
                                <Legend />
                                <Scatter name="Pass" data={scatterData.filter(d => d.status === 'Pass')} fill="#10B981" shape="circle" />
                                <Scatter name="Fail" data={scatterData.filter(d => d.status === 'Fail')} fill="#EF4444" shape="triangle" />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {activeTab === 'comparisons' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Pass/Fail by Parental Education</h3>
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={comparisonData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="Pass" stackId="a" fill="#3B82F6" />
                                    <Bar dataKey="Fail" stackId="a" fill="#9CA3AF" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                     </div>
                     <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Study Hours: Pass vs Fail (Avg & Max)</h3>
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={boxPlotData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="avg" barSize={40} fill="#8884d8" name="Avg Hours" />
                                    <Line type="monotone" dataKey="max" stroke="#ff7300" name="Max Hours" />
                                    <Line type="monotone" dataKey="min" stroke="#82ca9d" name="Min Hours" />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                     </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default Visualizations;
