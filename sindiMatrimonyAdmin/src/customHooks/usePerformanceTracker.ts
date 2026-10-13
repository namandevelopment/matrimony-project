import { useLayoutEffect, useEffect, useRef } from 'react';
import { perfMonitor, type ComponentRenderMetric } from '../utils/perfMonitor';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Hook to automatically track component render performance and identify culprit prop diffs.
 * 
 * @param componentName The human-readable name of the component being tracked.
 * @param props Optional current props object to detect which specific prop caused the re-render.
 * @returns ComponentRenderMetric snapshot
 */
export function usePerformanceTracker(
  componentName: string,
  props?: Record<string, unknown>
): ComponentRenderMetric | undefined {
  const startTimeRef = useRef<number>(0);
  const prevPropsRef = useRef<Record<string, unknown> | undefined>(props);
  const metricRef = useRef<ComponentRenderMetric | undefined>(undefined);

  // Record start time right before rendering
  startTimeRef.current = performance.now();

  useIsomorphicLayoutEffect(() => {
    const duration = Math.max(0.1, performance.now() - startTimeRef.current);
    metricRef.current = perfMonitor.recordRender(
      componentName,
      duration,
      prevPropsRef.current,
      props
    );
    prevPropsRef.current = props;
  });

  return metricRef.current;
}
