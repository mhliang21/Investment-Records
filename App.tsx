import React, { useState } from 'react';
import { AssetPosition } from './types';
import AssetForm from './components/AssetForm';
import ReportView from './components/ReportView';
import HistoryView from './components/HistoryView';
import { generateFinancialDiary } from './services/geminiService';
import { Sparkles, LayoutDashboard, History, PenTool, Wallet } from 'lucide-react';

const INITIAL_DATA: AssetPosition[] = [
  { id: '1', name: '红利低波50', category: 'AH_Stock', amount: 99000, monthlyGain: 475.95, totalGain: 4200 },
  { id: '2', name: '中欧红利优享', category: 'AH_Stock', amount: 47000, monthlyGain: 543.67, totalGain: 1200 },
  { id: '3', name: '纳斯达克100', category: 'US_Stock', amount: 64000, monthlyGain: 477.87, totalGain: 8500 },
  { id: '4', name: '黄金ETF联接', category: 'Commodity', amount: 113000, monthlyGain: 1199.06, totalGain: 15600 },
  { id: '5', name: '鹏华丰禄债券', category: 'Bond', amount: 73000, monthlyGain: 14.01, totalGain: 320 },
  { id: '6', name: '中银全球配置', category: 'Wealth', amount: 204000, monthlyGain: 0, totalGain: 1200 },
];

function App() {
  const [activeTab, setActiveTab] = useState<'edit' | 'view' | 'history'>('view');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]); 
  const [positions, setPositions] = useState<AssetPosition[]>(INITIAL_DATA);
  const [aiSummary, setAiSummary] = useState<string>("");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const handleGenerateSummary = async () => {
    setIsGeneratingAi(true);
    const summary = await generateFinancialDiary({
      date,
      positions,
    });
    setAiSummary(summary);
    setIsGeneratingAi(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans selection:bg-piggy-200">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-piggy-400 to-piggy-600 text-white p-2 rounded-xl shadow-lg shadow-piggy-200">
                <Wallet size={20} />
              </div>
              <span className="font-bold text-xl text-gray-700 tracking-tight">小猪理财</span>
            </div>
            
            {/* Desktop & Mobile Tab Switcher */}
            <div className="flex items-center gap-1 md:gap-2 bg-gray-100/50 p-1 rounded-full border border-gray-200/50">
              <button
                onClick={() => setActiveTab('edit')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === 'edit' 
                    ? 'bg-white text-piggy-600 shadow-sm ring-1 ring-black/5' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                }`}
              >
                <PenTool size={14} /> <span className="hidden sm:inline">记账</span>
              </button>
              <button
                onClick={() => setActiveTab('view')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === 'view' 
                    ? 'bg-white text-piggy-600 shadow-sm ring-1 ring-black/5' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                }`}
              >
                <LayoutDashboard size={14} /> <span className="hidden sm:inline">月报</span>
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeTab === 'history' 
                    ? 'bg-white text-piggy-600 shadow-sm ring-1 ring-black/5' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                }`}
              >
                <History size={14} /> <span className="hidden sm:inline">历史</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Actions Bar for View Mode */}
        {activeTab === 'view' && (
           <div className="flex justify-end mb-8 max-w-[800px] mx-auto">
              <button
                onClick={handleGenerateSummary}
                disabled={isGeneratingAi}
                className="group flex items-center gap-2 bg-white text-gray-600 hover:text-piggy-600 border border-gray-200 hover:border-piggy-200 px-6 py-2.5 rounded-full shadow-sm hover:shadow-lg hover:shadow-piggy-100 transition-all disabled:opacity-50"
              >
                <Sparkles size={16} className={isGeneratingAi ? 'animate-spin text-piggy-400' : 'text-yellow-400 group-hover:scale-110 transition-transform'} />
                <span className="font-medium text-sm">{isGeneratingAi ? '小猪正在思考...' : 'AI 智能点评'}</span>
              </button>
           </div>
        )}

        <div className="transition-all duration-500 ease-in-out">
          {activeTab === 'edit' && (
            <div className="max-w-4xl mx-auto animate-fade-in-up">
              <AssetForm 
                positions={positions} 
                onUpdate={setPositions} 
                date={date}
                onDateChange={setDate}
              />
            </div>
          )}
          
          {activeTab === 'view' && (
            <div className="animate-fade-in-up">
              <ReportView 
                date={date} 
                positions={positions} 
                aiSummary={aiSummary}
              />
            </div>
          )}

          {activeTab === 'history' && (
            <div className="animate-fade-in-up">
              <HistoryView />
            </div>
          )}
        </div>
      </main>
      
      <style>{`
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default App;