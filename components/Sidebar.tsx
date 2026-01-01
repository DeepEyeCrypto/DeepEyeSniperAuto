
import React from 'react';
import { LayoutDashboard, BrainCircuit, Terminal as TerminalIcon, Globe, Settings, Cpu, LineChart } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const menuItems = [
    { id: ViewState.TERMINAL, icon: <LineChart size={20} />, label: 'Trading Terminal' },
    { id: ViewState.DASHBOARD, icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { id: ViewState.INTELLIGENCE, icon: <BrainCircuit size={20} />, label: 'Intelligence' },
    { id: ViewState.SYSTEM_LOGS, icon: <TerminalIcon size={20} />, label: 'System Logs' },
    { id: ViewState.NETWORK, icon: <Globe size={20} />, label: 'Network' },
    { id: ViewState.SETTINGS, icon: <Settings size={20} />, label: 'Settings' },
  ];

  return (
    <div className="w-16 md:w-64 h-full bg-[#0B0E11] border-r border-white/5 flex flex-col items-center md:items-stretch py-6 transition-all duration-300 z-50">
      <div className="px-6 mb-10 flex items-center gap-3">
        <div className="bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/20">
          <Cpu className="text-cyan-400" size={24} />
        </div>
        <span className="hidden md:block font-bold text-lg tracking-wider text-white">DEEPEYE <span className="text-cyan-400">V5</span></span>
      </div>

      <nav className="flex-1 px-3 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all group ${
              currentView === item.id 
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <span className={currentView === item.id ? 'text-cyan-400' : 'group-hover:text-cyan-400 transition-colors'}>
              {item.icon}
            </span>
            <span className="hidden md:block font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="px-6 mt-auto">
        <div className="hidden md:block bg-slate-900/50 rounded-xl p-4 border border-white/5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Latency</span>
            <span className="text-[10px] font-mono text-emerald-400">14ms</span>
          </div>
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 w-[14%] shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
