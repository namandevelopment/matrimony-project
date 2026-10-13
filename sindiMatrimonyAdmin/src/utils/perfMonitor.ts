import fastDeepEqual from 'fast-deep-equal';

export interface ComponentRenderMetric {
  componentName: string;
  renderCount: number;
  lastDurationMs: number;
  avgDurationMs: number;
  maxDurationMs: number;
  lastRenderTimestamp: number;
  recentRenderTimestamps: number[];
  status: 'optimal' | 'warning' | 'critical';
  isThrashing: boolean; // More than 5 renders in 2 seconds
  lastChangedProps: string[];
}

export interface ApiLatencyMetric {
  id: string;
  url: string;
  method: string;
  durationMs: number;
  status: number | string;
  timestamp: number;
}

export interface SystemPerfSnapshot {
  fps: number;
  memoryUsedMb?: number;
  memoryLimitMb?: number;
  totalComponentsTracked: number;
  criticalComponentsCount: number;
  thrashingComponentsCount: number;
  avgApiLatencyMs: number;
}

type PerfListener = (metrics: Map<string, ComponentRenderMetric>, apis: ApiLatencyMetric[]) => void;

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, ComponentRenderMetric> = new Map();
  private apiMetrics: ApiLatencyMetric[] = [];
  private listeners: Set<PerfListener> = new Set();
  private maxApiLogs = 50;
  private fps = 60;
  private fpsFrameCount = 0;
  private fpsLastTimestamp = performance.now();
  private isMonitoring = true;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.initFpsLoop();
    }
  }

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  private initFpsLoop() {
    const loop = (now: number) => {
      this.fpsFrameCount++;
      if (now - this.fpsLastTimestamp >= 1000) {
        this.fps = Math.round((this.fpsFrameCount * 1000) / (now - this.fpsLastTimestamp));
        this.fpsFrameCount = 0;
        this.fpsLastTimestamp = now;
      }
      if (this.isMonitoring) {
        requestAnimationFrame(loop);
      }
    };
    if (typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(loop);
    }
  }

  /**
   * Record a component render with duration and optional props diff
   */
  public recordRender(
    componentName: string,
    durationMs: number,
    prevProps?: Record<string, unknown>,
    nextProps?: Record<string, unknown>
  ): ComponentRenderMetric {
    const now = Date.now();
    const existing = this.metrics.get(componentName);

    // Identify which props changed
    const changedProps: string[] = [];
    if (prevProps && nextProps) {
      const allKeys = new Set([...Object.keys(prevProps), ...Object.keys(nextProps)]);
      for (const key of allKeys) {
        if (!fastDeepEqual(prevProps[key], nextProps[key])) {
          changedProps.push(key);
        }
      }
    }

    let metric: ComponentRenderMetric;

    if (existing) {
      const renderCount = existing.renderCount + 1;
      const avgDurationMs = Number(((existing.avgDurationMs * existing.renderCount + durationMs) / renderCount).toFixed(2));
      const maxDurationMs = Number(Math.max(existing.maxDurationMs, durationMs).toFixed(2));
      
      // Keep only renders in last 2 seconds to detect thrashing
      const recentRenderTimestamps = [...existing.recentRenderTimestamps, now].filter(t => now - t <= 2000);
      const isThrashing = recentRenderTimestamps.length >= 6;

      const status: 'optimal' | 'warning' | 'critical' = 
        durationMs > 16.6 || isThrashing ? 'critical' : durationMs > 8 ? 'warning' : 'optimal';

      metric = {
        componentName,
        renderCount,
        lastDurationMs: Number(durationMs.toFixed(2)),
        avgDurationMs,
        maxDurationMs,
        lastRenderTimestamp: now,
        recentRenderTimestamps,
        status,
        isThrashing,
        lastChangedProps: changedProps.length > 0 ? changedProps : existing.lastChangedProps,
      };
    } else {
      const status: 'optimal' | 'warning' | 'critical' = durationMs > 16.6 ? 'critical' : durationMs > 8 ? 'warning' : 'optimal';
      metric = {
        componentName,
        renderCount: 1,
        lastDurationMs: Number(durationMs.toFixed(2)),
        avgDurationMs: Number(durationMs.toFixed(2)),
        maxDurationMs: Number(durationMs.toFixed(2)),
        lastRenderTimestamp: now,
        recentRenderTimestamps: [now],
        status,
        isThrashing: false,
        lastChangedProps: changedProps,
      };
    }

    this.metrics.set(componentName, metric);
    this.notify();
    return metric;
  }

  /**
   * Record API request latency
   */
  public recordApi(url: string, method: string, durationMs: number, status: number | string) {
    const metric: ApiLatencyMetric = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      url,
      method: method.toUpperCase(),
      durationMs: Number(durationMs.toFixed(2)),
      status,
      timestamp: Date.now(),
    };

    this.apiMetrics.unshift(metric);
    if (this.apiMetrics.length > this.maxApiLogs) {
      this.apiMetrics.pop();
    }
    this.notify();
  }

  public getMetrics(): ComponentRenderMetric[] {
    return Array.from(this.metrics.values());
  }

  public getApiMetrics(): ApiLatencyMetric[] {
    return [...this.apiMetrics];
  }

  public getSystemSnapshot(): SystemPerfSnapshot {
    const list = this.getMetrics();
    const critical = list.filter(m => m.status === 'critical').length;
    const thrashing = list.filter(m => m.isThrashing).length;

    let totalApiTime = 0;
    this.apiMetrics.forEach(a => (totalApiTime += a.durationMs));
    const avgApiLatencyMs = this.apiMetrics.length > 0 ? Number((totalApiTime / this.apiMetrics.length).toFixed(1)) : 0;

    let memoryUsedMb: number | undefined;
    let memoryLimitMb: number | undefined;

    // Check Chrome / Chromium performance.memory
    if (typeof window !== 'undefined' && 'performance' in window && 'memory' in (window.performance as unknown as { memory: unknown })) {
      const mem = (window.performance as unknown as { memory: { usedJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
      if (mem) {
        memoryUsedMb = Number((mem.usedJSHeapSize / (1024 * 1024)).toFixed(1));
        memoryLimitMb = Number((mem.jsHeapSizeLimit / (1024 * 1024)).toFixed(1));
      }
    }

    return {
      fps: this.fps,
      memoryUsedMb,
      memoryLimitMb,
      totalComponentsTracked: list.length,
      criticalComponentsCount: critical,
      thrashingComponentsCount: thrashing,
      avgApiLatencyMs,
    };
  }

  public clear() {
    this.metrics.clear();
    this.apiMetrics = [];
    this.notify();
  }

  public subscribe(listener: PerfListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn(this.metrics, this.apiMetrics));
  }
}

export const perfMonitor = PerformanceMonitor.getInstance();
