import React, { useRef, useMemo, useCallback } from 'react';
import fastDeepEqual from 'fast-deep-equal';

/**
 * Universal Deep Equality comparison powered by fast-deep-equal.
 * Checks primitive values, objects, arrays, and dates deeply without circular reference hazards.
 */
export const deepEqual = <T = unknown>(a: T, b: T): boolean => {
  return fastDeepEqual(a, b);
};

/**
 * HOC that wraps React.memo with fast-deep-equal props comparison.
 * Prevents unnecessary re-renders when parent creates new object/array references
 * that have identical structural values.
 */
export function memoWithDeepEqual<P extends object>(
  Component: React.ComponentType<P>,
  displayName?: string
): React.NamedExoticComponent<P> {
  const MemoizedComponent = React.memo(Component, (prevProps, nextProps) => {
    return fastDeepEqual(prevProps, nextProps);
  });

  MemoizedComponent.displayName = displayName || Component.displayName || Component.name || 'MemoDeepEqual';
  return MemoizedComponent;
}

/**
 * Hook to memoize dependencies deeply across renders.
 */
export function useDeepCompareMemoize<T>(value: T): T {
  const ref = useRef<T>(value);
  const signalRef = useRef<number>(0);

  if (!fastDeepEqual(value, ref.current)) {
    ref.current = value;
    signalRef.current += 1;
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => ref.current, [signalRef.current]);
}

/**
 * Deep equality aware useMemo. Only recalculates when dependencies change in deep value.
 */
export function useDeepCompareMemo<T>(factory: () => T, deps: React.DependencyList): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(factory, useDeepCompareMemoize(deps));
}

/**
 * Deep equality aware useCallback.
 */
export function useDeepCompareCallback<T extends (...args: never[]) => unknown>(
  callback: T,
  deps: React.DependencyList
): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(callback, useDeepCompareMemoize(deps));
}
