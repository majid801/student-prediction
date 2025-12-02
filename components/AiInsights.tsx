import React, { useState } from 'react';
import { Student } from '../types';
import { generateInsight } from '../services/geminiService';
import { MessageSquare, Send, Sparkles } from 'lucide-react';

interface AiInsightsProps {
  students: Student[];
}

const AiInsights: React.FC<AiInsightsProps> = ({ students }) => {
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState<{ role: 'user' | 'ai'; content: string }[]>([
    { role: 'ai', content: "Hello! I'm your Data Analyst Assistant. I have context on all 500 students. Ask me anything about the data trends!" }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!query.trim()) return;

    const userMsg = query;
    setQuery('');
    setHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    const response = await generateInsight(userMsg, students);
    
    setHistory(prev => [...prev, { role: 'ai', content: response }]);
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)] min-h-[500px]">
      <div className="lg:col-span-1 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-6">
            <Sparkles className="text-yellow-300" />
            <h2 className="text-2xl font-bold">AI Analyst</h2>
          </div>
          <p className="opacity-90 mb-4">
            Powered by Gemini 2.5 Flash, this assistant analyzes the Student Performance Dataset in real-time.
          </p>
          <div className="space-y-3">
            <h3 className="font-semibold text-sm uppercase tracking-wider opacity-70">Try asking:</h3>
            <button onClick={() => setQuery("What is the correlation between attendance and final scores?")} className="w-full text-left bg-white/10 hover:bg-white/20 p-3 rounded-lg text-sm transition text-white">
              "Correlation between attendance and scores?"
            </button>
            <button onClick={() => setQuery("How does parental education affect student success?")} className="w-full text-left bg-white/10 hover:bg-white/20 p-3 rounded-lg text-sm transition text-white">
              "Impact of parental education?"
            </button>
            <button onClick={() => setQuery("Summarize the main factors leading to failure.")} className="w-full text-left bg-white/10 hover:bg-white/20 p-3 rounded-lg text-sm transition text-white">
              "Factors leading to failure?"
            </button>
          </div>
        </div>
        <div className="text-xs opacity-50 mt-4">
            Note: Insights are generated based on the loaded dataset summary.
        </div>
      </div>

      <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
          {history.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
             <div className="flex justify-start">
               <div className="bg-white border border-gray-200 text-gray-500 p-4 rounded-2xl rounded-bl-none shadow-sm flex items-center space-x-2">
                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75" />
                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
               </div>
             </div>
          )}
        </div>
        <div className="p-4 bg-white border-t border-gray-100 flex items-center space-x-2">
          <input
            type="text"
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            placeholder="Ask a question about the data..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={loading}
          />
          <button 
            onClick={handleSend}
            disabled={loading || !query.trim()}
            className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiInsights;
