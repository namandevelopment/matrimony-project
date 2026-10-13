import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, 
  Zap, 
  AlertTriangle, 
  Clock, 
  Trash2, 
  Download, 
  ChevronDown, 
  Cpu, 
  Flame, 
  Layers, 
  CheckCircle2, 
  ShieldAlert,
  Server
} from 'lucide-react';
import { perfMonitor, type ComponentRenderMetric, type ApiLatencyMetric, type SystemPerfSnapshot } from '../utils/perfMonitor';
import { memoWithDeepEqual } from '../utils/memoUtils';

interface PerformanceWidgetProps {
  initialOpen?: boolean;
  minimized?: boolean;
}

export const PerformanceMonitorWidget: React.FC<PerformanceWidgetProps> = memoWithDeepEqual(({
  initialOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [activeTab, setActiveTab] = useState<'components' | 'apis' | 'system'>('components');
  const [metrics, setMetrics] = useState<ComponentRenderMetric[]>([]);
  const [apiMetrics, setApiMetrics] = useState<ApiLatencyMetric[]>([]);
  const [system, setSystem] = useState<SystemPerfSnapshot>(perfMonitor.getSystemSnapshot());

  // Subscribe to real-time perf monitor updates
  useEffect(() => {
    // Initial fetch
    setMetrics(perfMonitor.getMetrics());
    setApiMetrics(perfMonitor.getApiMetrics());
    setSystem(perfMonitor.getSystemSnapshot());

    // Throttled refresh so the monitoring widget itself doesn't cause frame drops
    const interval = setInterval(() => {
      setMetrics(perfMonitor.getMetrics());
      setApiMetrics(perfMonitor.getApiMetrics());
      setSystem(perfMonitor.getSystemSnapshot());
    }, 800);

    return () => clearInterval(interval);
  }, []);

  // Sorted components (slowest / most renders first)
  const sortedMetrics = useMemo(() => {
    return [...metrics].sort((a, b) => {
      if (b.status === 'critical' && a.status !== 'critical') return 1;
      if (a.status === 'critical' && b.status !== 'critical') return -1;
      return b.lastDurationMs - a.lastDurationMs;
    });
  }, [metrics]);

  const handleClear = () => {
    perfMonitor.clear();
    setMetrics([]);
    setApiMetrics([]);
    setSystem(perfMonitor.getSystemSnapshot());
  };

  const handleExport = () => {
    const data = {
      timestamp: new Date().toISOString(),
      system,
      components: metrics,
      apis: apiMetrics,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sindhi-admin-perf-audit-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Status color helpers
  const getDurationBadge = (duration: number, status: string) => {
    if (status === 'critical') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-700">
          <AlertTriangle className="w-3 h-3" />
          {duration}ms (Jank)
        </span>
      );
    }
    if (status === 'warning') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-700">
          <Clock className="w-3 h-3" />
          {duration}ms
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-700">
        <CheckCircle2 className="w-3 h-3" />
        {duration}ms
      </span>
    );
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 font-sans text-xs">
      {/* Floating Pill Toggle Button */}
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className={`flex items-center gap-2.5 px-3.5 py-2 rounded-full shadow-2xl backdrop-blur-md transition-all duration-200 border cursor-pointer hover:scale-105 ${
            system.criticalComponentsCount > 0 || system.thrashingComponentsCount > 0
              ? 'bg-red-950/90 border-red-500 text-red-200 shadow-red-500/20 animate-pulse'
              : 'bg-slate-900/90 border-slate-700 text-slate-200 shadow-slate-900/30'
          }`}
          title="Open Performance Monitor"
        >
          <Activity className="w-4 h-4 text-emerald-400" />
          <span className="font-bold flex items-center gap-1">
            <span className={system.fps < 45 ? 'text-amber-400' : 'text-emerald-400'}>
              {system.fps} FPS
            </span>
          </span>
          {system.memoryUsedMb && (
            <span className="text-slate-400 border-l border-slate-700 pl-2">
              {system.memoryUsedMb}MB
            </span>
          )}
          {system.criticalComponentsCount > 0 && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-red-500/30 text-red-300 font-semibold text-[10px]">
              <AlertTriangle className="w-3 h-3 text-red-400" />
              {system.criticalComponentsCount} slow
            </span>
          )}
          {system.thrashingComponentsCount > 0 && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-500/30 text-amber-300 font-semibold text-[10px]">
              <Flame className="w-3 h-3 text-amber-400" />
              {system.thrashingComponentsCount} thrashed
            </span>
          )}
        </button>
      ) : (
        /* Expanded Performance Modal / Dashboard HUD */
        <div className="w-[95vw] sm:w-[580px] max-h-[82vh] bg-slate-950/95 text-slate-200 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900/80 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  Performance & Re-render Monitor
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                    Live HUD
                  </span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Real-time render budgets, props diffs & network profiling
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleClear}
                title="Clear all performance records"
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleExport}
                title="Export JSON Performance Report"
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Stat Ribbon */}
          <div className="grid grid-cols-4 gap-2 px-4 py-2.5 bg-slate-900/40 border-b border-slate-800/60 text-center">
            <div className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-medium">FPS Rate</div>
              <div className={`text-sm font-bold ${system.fps >= 50 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {system.fps} <span className="text-[10px] text-slate-500 font-normal">fps</span>
              </div>
            </div>
            <div className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-medium">Heap Memory</div>
              <div className="text-sm font-bold text-sky-400">
                {system.memoryUsedMb ? `${system.memoryUsedMb}MB` : 'N/A'}
              </div>
            </div>
            <div className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-medium">Critical Renders</div>
              <div className={`text-sm font-bold ${system.criticalComponentsCount > 0 ? 'text-red-400' : 'text-slate-300'}`}>
                {system.criticalComponentsCount}
              </div>
            </div>
            <div className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400 font-medium">Avg API Latency</div>
              <div className="text-sm font-bold text-indigo-400">
                {system.avgApiLatencyMs}ms
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="flex items-center px-4 pt-2 border-b border-slate-800 gap-2">
            <button
              onClick={() => setActiveTab('components')}
              className={`pb-2 px-2 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition ${
                activeTab === 'components'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Components ({metrics.length})
            </button>
            <button
              onClick={() => setActiveTab('apis')}
              className={`pb-2 px-2 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition ${
                activeTab === 'apis'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              APIs ({apiMetrics.length})
            </button>
            <button
              onClick={() => setActiveTab('system')}
              className={`pb-2 px-2 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition ${
                activeTab === 'system'
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              Load & Tips
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-4 overflow-y-auto max-h-[50vh] space-y-3">
            {/* 1. COMPONENTS TAB */}
            {activeTab === 'components' && (
              <div className="space-y-2">
                {sortedMetrics.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Activity className="w-8 h-8 mx-auto mb-2 opacity-30 text-emerald-400" />
                    <p>No components tracked yet.</p>
                    <p className="text-[11px] text-slate-600 mt-1">
                      Render tracked screens to see real-time execution speeds.
                    </p>
                  </div>
                ) : (
                  sortedMetrics.map((item) => (
                    <div
                      key={item.componentName}
                      className={`p-2.5 rounded-xl border transition ${
                        item.status === 'critical'
                          ? 'bg-red-950/20 border-red-900/60'
                          : item.status === 'warning'
                          ? 'bg-amber-950/20 border-amber-900/50'
                          : 'bg-slate-900/60 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs">
                            {item.componentName}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                            ×{item.renderCount} renders
                          </span>
                          {item.isThrashing && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-amber-900/40 text-amber-300 text-[10px] border border-amber-700/50">
                              <Flame className="w-2.5 h-2.5 text-amber-400" />
                              Thrashing
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {getDurationBadge(item.lastDurationMs, item.status)}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/40">
                        <div className="flex items-center gap-3">
                          <span>Avg: <b className="text-slate-300">{item.avgDurationMs}ms</b></span>
                          <span>Max: <b className="text-slate-300">{item.maxDurationMs}ms</b></span>
                        </div>

                        {item.lastChangedProps.length > 0 ? (
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-slate-500">Changed Props:</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-950/60 text-indigo-300 font-mono border border-indigo-800/40">
                              {item.lastChangedProps.join(', ')}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-600">No prop changes (Memo effective)</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 2. APIS TAB */}
            {activeTab === 'apis' && (
              <div className="space-y-2">
                {apiMetrics.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <Server className="w-8 h-8 mx-auto mb-2 opacity-30 text-indigo-400" />
                    <p>No API calls logged yet.</p>
                  </div>
                ) : (
                  apiMetrics.map((api) => (
                    <div
                      key={api.id}
                      className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5 truncate max-w-[70%]">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            api.method === 'GET'
                              ? 'bg-blue-950 text-blue-400 border border-blue-800'
                              : api.method === 'POST'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : api.method === 'PUT'
                              ? 'bg-amber-950 text-amber-400 border border-amber-800'
                              : 'bg-rose-950 text-rose-400 border border-rose-800'
                          }`}
                        >
                          {api.method}
                        </span>
                        <span className="font-mono text-xs text-slate-300 truncate" title={api.url}>
                          {api.url}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 font-mono">
                        <span
                          className={`font-semibold text-xs ${
                            api.durationMs > 500
                              ? 'text-red-400'
                              : api.durationMs > 250
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {api.durationMs}ms
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400">
                          {api.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 3. SYSTEM & OPTIMIZATION TIPS */}
            {activeTab === 'system' && (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="font-bold text-white text-xs flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-emerald-400" />
                    Sindhi Matrimony Optimization Rules
                  </div>
                  <ul className="space-y-1.5 text-slate-300 text-[11px] list-disc list-inside">
                    <li>
                      <b className="text-white">Strict Props Discipline:</b> All state and actions are passed directly via props, avoiding unnecessary context re-renders.
                    </li>
                    <li>
                      <b className="text-white">Fast-Deep-Equal Memoization:</b> Heavy components like <code className="text-amber-300 font-mono">DataTable</code> and <code className="text-amber-300 font-mono">FilterBar</code> are wrapped with <code className="text-emerald-300 font-mono">memoWithDeepEqual</code>.
                    </li>
                    <li>
                      <b className="text-white">Frame Budget &lt; 16.6ms:</b> Any render exceeding 16.6ms causes dropped frames (Jank) and is highlighted in red.
                    </li>
                    <li>
                      <b className="text-white">Zero Log Spam:</b> HTTP requests only log on error or latency spikes &gt; 300ms.
                    </li>
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-900/40 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs text-indigo-300">Stress Test Simulator</div>
                    <div className="text-[11px] text-slate-400">
                      Simulate 20 heavy state updates to verify deep equality filter
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      // Perform test simulation
                      for (let i = 0; i < 10; i++) {
                        perfMonitor.recordRender('SimulatedHeavyTable', 18.4, { filter: 'Sindhi', page: 1 }, { filter: 'Sindhi', page: 1 });
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs cursor-pointer transition"
                  >
                    Run Test
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Active Profiler Session
            </span>
            <span>Target: &lt; 16.6ms per render</span>
          </div>
        </div>
      )}
    </div>
  );
});

PerformanceMonitorWidget.displayName = 'PerformanceMonitorWidget';
