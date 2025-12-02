
import React, { useState, useMemo } from 'react';
import { Student } from '../types';
import { Search, Filter, Hash } from 'lucide-react';

interface DataGridProps {
  students: Student[];
}

const DataGrid: React.FC<DataGridProps> = ({ students }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Student; direction: 'asc' | 'desc' } | null>(null);
  const [filters, setFilters] = useState({
      gender: 'All',
      education: 'All'
  });

  const sortedStudents = useMemo(() => {
    let sortableItems = [...students];
    
    // Filters
    if (filters.gender !== 'All') {
        sortableItems = sortableItems.filter(s => s.Gender === filters.gender);
    }
    if (filters.education !== 'All') {
        sortableItems = sortableItems.filter(s => s.Parental_Education_Level === filters.education);
    }

    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    if (searchTerm) {
        return sortableItems.filter(s => 
            s.Student_ID.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    return sortableItems;
  }, [students, sortConfig, searchTerm, filters]);

  const requestSort = (key: keyof Student) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (name: keyof Student) => {
      if (!sortConfig || sortConfig.key !== name) return '↕';
      return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  // Stats for sidebar
  const stats = useMemo(() => {
      const vals = sortedStudents.map(s => s.Final_Exam_Score);
      const mean = vals.reduce((a,b)=>a+b,0)/vals.length || 0;
      const sorted = [...vals].sort((a,b)=>a-b);
      const median = sorted[Math.floor(sorted.length/2)] || 0;
      const std = Math.sqrt(vals.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / vals.length) || 0;
      return { mean, median, std, count: vals.length };
  }, [sortedStudents]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 animate-fade-in">
        
        {/* Sidebar Controls */}
        <div className="w-full lg:w-64 space-y-6">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center"><Filter size={16} className="mr-2"/> Filters</h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">Gender</label>
                        <select 
                            className="w-full mt-1 border border-gray-200 rounded-lg p-2 text-sm"
                            value={filters.gender}
                            onChange={(e) => setFilters(prev => ({...prev, gender: e.target.value}))}
                        >
                            <option value="All">All Genders</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase">Parent Education</label>
                        <select 
                            className="w-full mt-1 border border-gray-200 rounded-lg p-2 text-sm"
                            value={filters.education}
                            onChange={(e) => setFilters(prev => ({...prev, education: e.target.value}))}
                        >
                            <option value="All">All Levels</option>
                            <option value="High School">High School</option>
                            <option value="Bachelors">Bachelors</option>
                            <option value="Masters">Masters</option>
                            <option value="PhD">PhD</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center"><Hash size={16} className="mr-2"/> Summary Stats</h3>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-500">Count</span>
                        <span className="font-mono font-medium">{stats.count}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Mean Score</span>
                        <span className="font-mono font-medium">{stats.mean.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Median Score</span>
                        <span className="font-mono font-medium">{stats.median}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500">Std Dev</span>
                        <span className="font-mono font-medium">{stats.std.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Main Table */}
        <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-800">Student Records</h3>
                <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Search by ID..." 
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 font-medium">
                    <tr>
                    <th onClick={() => requestSort('Student_ID')} className="px-6 py-3 cursor-pointer hover:bg-gray-100">ID {getSortIndicator('Student_ID')}</th>
                    <th onClick={() => requestSort('Gender')} className="px-6 py-3 cursor-pointer hover:bg-gray-100">Gender {getSortIndicator('Gender')}</th>
                    <th onClick={() => requestSort('Study_Hours_per_Week')} className="px-6 py-3 cursor-pointer hover:bg-gray-100 text-right">Study Hrs {getSortIndicator('Study_Hours_per_Week')}</th>
                    <th onClick={() => requestSort('Attendance_Rate')} className="px-6 py-3 cursor-pointer hover:bg-gray-100 text-right">Attendance {getSortIndicator('Attendance_Rate')}</th>
                    <th onClick={() => requestSort('Parental_Education_Level')} className="px-6 py-3 cursor-pointer hover:bg-gray-100">Parent Edu {getSortIndicator('Parental_Education_Level')}</th>
                    <th onClick={() => requestSort('Final_Exam_Score')} className="px-6 py-3 cursor-pointer hover:bg-gray-100 text-right">Final Score {getSortIndicator('Final_Exam_Score')}</th>
                    <th onClick={() => requestSort('Pass_Fail')} className="px-6 py-3 cursor-pointer hover:bg-gray-100">Status {getSortIndicator('Pass_Fail')}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {sortedStudents.slice(0, 100).map((student) => (
                    <tr key={student.Student_ID} className="hover:bg-gray-50">
                        <td className="px-6 py-3 font-medium text-gray-900">{student.Student_ID}</td>
                        <td className="px-6 py-3 text-gray-500">{student.Gender}</td>
                        <td className="px-6 py-3 text-right text-gray-500">{student.Study_Hours_per_Week}</td>
                        <td className="px-6 py-3 text-right text-gray-500">{student.Attendance_Rate}%</td>
                        <td className="px-6 py-3 text-gray-500">{student.Parental_Education_Level}</td>
                        <td className="px-6 py-3 text-right text-gray-900 font-bold">{student.Final_Exam_Score}</td>
                        <td className="px-6 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${student.Pass_Fail === 'Pass' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {student.Pass_Fail}
                        </span>
                        </td>
                    </tr>
                    ))}
                    {sortedStudents.length === 0 && (
                        <tr>
                            <td colSpan={7} className="text-center py-8 text-gray-400">No students found matching your search.</td>
                        </tr>
                    )}
                </tbody>
                </table>
                {sortedStudents.length > 100 && (
                    <div className="p-4 text-center text-xs text-gray-400 bg-gray-50 border-t border-gray-100">
                        Showing first 100 rows of {sortedStudents.length}
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default DataGrid;
