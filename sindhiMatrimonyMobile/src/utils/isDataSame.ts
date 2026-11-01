import equal from 'fast-deep-equal';

/**
 * Fast deep-equality comparator to prevent redundant Redux mutations
 * and unnecessary component re-renders when API payloads remain unchanged.
 */
export const isDataSame = <T = any>(prevData: T, nextData: T): boolean => {
  if (prevData === nextData) return true;
  if (prevData == null || nextData == null) return prevData === nextData;
  return equal(prevData, nextData);
};

export default isDataSame;

