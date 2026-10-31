import { useEffect, useState } from 'react';
import { Keyboard, type KeyboardEvent, Platform } from 'react-native';

interface KeyboardState {
  isKeyboardVisible: boolean;
  keyboardHeight: number;
}

const useKeyboardVisible = () => {
  // Default is false and 0
  const [keyboardState, setKeyboardState] = useState<KeyboardState>({
    isKeyboardVisible: false,
    keyboardHeight: 0,
  });

  useEffect(() => {
    // iOS supports smooth 'will' events; Android natively supports 'did' events across all versions (including Android 15+)
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const handleKeyboardShow = (event: KeyboardEvent) => {
      const height = event.endCoordinates?.height ?? 0;
      const isVisible = height > 0;

      setKeyboardState(prev => {
        // Prevent redundant re-renders if state did not change
        if (
          prev.isKeyboardVisible === isVisible &&
          prev.keyboardHeight === height
        ) {
          return prev;
        }
        return { isKeyboardVisible: isVisible, keyboardHeight: height };
      });
    };

    const handleKeyboardHide = () => {
      setKeyboardState(prev => {
        // Prevent redundant re-renders
        if (!prev.isKeyboardVisible && prev.keyboardHeight === 0) {
          return prev;
        }
        return { isKeyboardVisible: false, keyboardHeight: 0 };
      });
    };

    const showSubscription = Keyboard.addListener(showEvent, handleKeyboardShow);
    const hideSubscription = Keyboard.addListener(hideEvent, handleKeyboardHide);

    // Sync on mount only if keyboard is already open
    if (Keyboard.isVisible?.()) {
      const metrics = Keyboard.metrics?.();
      const currentHeight = metrics?.height ?? 0;
      if (currentHeight > 0) {
        setKeyboardState({
          isKeyboardVisible: true,
          keyboardHeight: currentHeight,
        });
      }
    }

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return {
    isKeyboardVisible: keyboardState.isKeyboardVisible,
    keyboardHeight: keyboardState.keyboardHeight,
    dismissKeyboard: Keyboard.dismiss,
  };
};

export default useKeyboardVisible;