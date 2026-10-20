import { useCallback } from 'react';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { AppDispatch, RootState } from '../Store/store';
import { setReduxData, updateAnyState } from '../slices/dataSlice';

// Typed versions of useDispatch and useSelector for RTK
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * 🔥 CUSTOM HOOK TO EASILY UPDATE ANY REDUX STATE 🔥
 */
export const useSetReduxState = () => {
  const dispatch = useAppDispatch();
  return useCallback(
    (keyOrObject: string | Record<string, any>, value?: any) => {
      return setReduxData(dispatch, keyOrObject, value);
    },
    [dispatch],
  );
};

export { setReduxData, updateAnyState };
