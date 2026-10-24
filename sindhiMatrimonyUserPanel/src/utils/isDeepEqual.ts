import React from "react";
import equal from "fast-deep-equal";

/**
 * Universal Deep Equality comparison utility powered by fast-deep-equal.
 * Reusable across React.memo, state updates, useRef guards, and custom hooks.
 */
export const isDeepEqual = <T = any>(a: T, b: T): boolean => {
  return equal(a, b);
};

/**
 * HOC wrapping React.memo with fast-deep-equal props comparison.
 * Prevents re-renders unless component props structurally change.
 */
export function memoWithDeepEqual<P extends object>(
  Component: React.ComponentType<P>,
  displayName?: string
): React.NamedExoticComponent<P> {
  const MemoizedComponent = React.memo(Component, (prevProps, nextProps) => {
    return equal(prevProps, nextProps);
  });

  MemoizedComponent.displayName =
    displayName || Component.displayName || Component.name || "MemoDeepEqual";
  return MemoizedComponent;
}

export default isDeepEqual;
