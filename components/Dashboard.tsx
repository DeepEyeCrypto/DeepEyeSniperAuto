import React from 'react';
import { Server, HardDrive, Cpu, ShieldCheck, Zap, Activity } from 'lucide-react';
import { SystemMetric } from '../types';

interface DashboardProps {
  metrics: SystemMetric[];
}

const Dashboard: React.FC<DashboardProps> = ({ metrics }) => {
  const current = metrics[metrics.length - 1] || { cpu: 12.4, memory: 45.2, latency: 12 };
  
  const stats = [
    { label: 'CPU LOAD', value: `${current.cpu.toFixed(1)}%`, icon: <Cpu size={16}/>, color: 'text-cyan-400', load: current.cpu },
    { label: 'MEM_POOL', value: `${current.memory.toFixed(1)}%`, icon: <Server size={16}/>, color: 'text-purple-400', load: current.memory },
    { label: 'DISK I/O', value: '450 MB/s', icon: <HardDrive size={16}/>, color: 'text-amber-400', load: 35 },
    { label: 'LATENCY', value: `${current.latency}ms`, icon: <Activity size={16}/>, color: 'text-emerald-400', load: current.latency * 2 },
  ];

  return (
    <div className="p-8 space-y-8 h-full overflow-y-auto bg-[#060809] pb-10">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Mainframe Telemetry</h1>
          <p className="text-slate-500 text-xs mt-1 font-mono uppercase tracking-widest">Stage 3 Stable CSS Grid</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/5 border border-emerald-500/10 rounded-md">
            <ShieldCheck className="text-emerald-500" size={14} />
            <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Integrity: 100%</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#0B0E11] border border-[#1F2226] p-5 rounded-xl transition-all cursor-default relative overflow-hidden group">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#1F2226] rounded-lg border border-white/5">
                <span className={stat.color}>{stat.icon}</span>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{stat.label}</div>
                <div className="text-xl font-bold text-white">{stat.value}</div>
              </div>
            </div>
            <div className="h-1 bg-[#1F2226] rounded-full overflow-hidden">
              <div className={`h-full transition-all duration-700 bg-current ${stat.color}`} style={{ width: `${stat.load}%` }}></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#0B0E11] border border-[#1F2226] p-6 rounded-xl min-h-[400px] flex flex-col">
          <h3 className="font-bold text-sm text-white uppercase tracking-widest mb-10">Buffer Visualization</h3>
          <div className="flex-1 flex items-end gap-1 px-4">
            {metrics.map((m, i) => (
               <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                 <div className="w-full bg-cyan-500/20 rounded-t-sm transition-all hover:bg-cyan-500/40" style={{ height: `${m.cpu}%` }}></div>
                 <div className="w-full bg-purple-500/20 rounded-b-sm transition-all hover:bg-purple-500/40" style={{ height: `${m.memory / 2}%` }}></div>
               </div>
            ))}
            {metrics.length === 0 && <div className="w-full h-full flex items-center justify-center text-slate-600 text-[10px] font-mono animate-pulse">Awaiting Telemetry Packet...</div>}
          </div>
        </div>

        <div className="bg-[#0B0E11] border border-[#1F2226] p-6 rounded-xl flex flex-col">
          <h3 className="font-bold text-sm text-white uppercase tracking-widest mb-8">Process Queue</h3>
          <div className="flex-1 space-y-6">
            {[
              { name: 'Core_Kernel', status: 'ALIVE', load: 88, color: 'bg-emerald-500' },
              { name: 'UI_Renderer', status: 'ALIVE', load: 12, color: 'bg-cyan-500' },
              { name: 'IPC_Watcher', status: 'ALIVE', load: 5, color: 'bg-purple-500' },
            ].map((proc, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="text-slate-300 font-bold">{proc.name}</span>
                  <span className="text-emerald-500 font-bold">{proc.status}</span>
                </div>
                <div className="h-1 bg-[#1F2226] rounded-full overflow-hidden">
                  <div className={`h-full ${proc.color}`} style={{ width: `${proc.load}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;