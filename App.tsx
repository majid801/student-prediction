
import React, { useState, useEffect } from 'react';
import { parseCsv, RAW_CSV_DATA } from './utils/csvData';
import { Student, ViewState } from './types';
import Dashboard from './components/Dashboard';
import DataGrid from './components/DataGrid';
import AiInsights from './components/AiInsights';
import Predictor from './components/Predictor';
import Visualizations from './components/Visualizations';
import StudentReport from './components/StudentReport';
import About from './components/About';
import { LayoutDashboard, Table, Brain, Sparkles, BookOpen, BarChart2, FileText, Info } from 'lucide-react';

const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);

  useEffect(() => {
    // Parse the data on mount
    const data = parseCsv(RAW_CSV_DATA);
    setStudents(data);
  }, []);

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard students={students} />;
      case ViewState.DATA_GRID:
        return <DataGrid students={students} />;
      case ViewState.VISUALIZATIONS:
        return <Visualizations students={students} />;
      case ViewState.STUDENT_REPORT:
        return <StudentReport students={students} />;
      case ViewState.AI_INSIGHTS:
        return <AiInsights students={students} />;
      case ViewState.PREDICTOR:
        return <Predictor />;
      case ViewState.ABOUT:
        return <About />;
      default:
        return <Dashboard students={students} />;
    }
  };

  const NavButton = ({ view, icon: Icon, label, special = false }: { view: ViewState, icon: any, label: string, special?: boolean }) => (
      <button
        onClick={() => setCurrentView(view)}
        className={`px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center ${
            currentView === view 
            ? special ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md' : 'bg-indigo-50 text-indigo-700' 
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
        }`}
        >
        <Icon className="mr-2 h-4 w-4" />
        {label}
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-[#f8fafc]">
      {/* Navigation Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => setCurrentView(ViewState.DASHBOARD)}>
              <div className="bg-indigo-600 p-1.5 rounded-lg mr-3">
                  <BookOpen className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">EduMetric AI</h1>
            </div>
            <nav className="hidden md:flex space-x-1 items-center">
              <NavButton view={ViewState.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
              <NavButton view={ViewState.DATA_GRID} icon={Table} label="Explore Data" />
              <NavButton view={ViewState.VISUALIZATIONS} icon={BarChart2} label="Visualizations" />
              <NavButton view={ViewState.STUDENT_REPORT} icon={FileText} label="Student Report" />
              <NavButton view={ViewState.PREDICTOR} icon={Brain} label="Predictor" />
              <NavButton view={ViewState.ABOUT} icon={Info} label="About" />
              <div className="w-px h-6 bg-gray-200 mx-2"></div>
              <NavButton view={ViewState.AI_INSIGHTS} icon={Sparkles} label="AI Analyst" special />
            </nav>
            {/* Mobile Menu Placeholder - keeping simple for this request */}
            <div className="md:hidden flex items-center">
                 <button onClick={() => setCurrentView(ViewState.DASHBOARD)} className="text-gray-500"><LayoutDashboard /></button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderContent()}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 EduMetric AI. Built for resume showcase.
          </p>
          <div className="flex space-x-4 text-gray-400 text-sm">
              <span>React 19</span>
              <span>•</span>
              <span>Recharts</span>
              <span>•</span>
              <span>Gemini 2.5 Flash</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
