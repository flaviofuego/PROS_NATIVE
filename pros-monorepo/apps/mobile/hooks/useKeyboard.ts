import { useState, useEffect } from 'react';
import { Keyboard, Platform, KeyboardEvent } from 'react-native';

interface KeyboardState {
  isKeyboardVisible: boolean;
  keyboardHeight: number;
}

/**
 * Hook to track keyboard visibility and height
 */
export function useKeyboard(): KeyboardState {
  const [keyboardState, setKeyboardState] = useState<KeyboardState>({
    isKeyboardVisible: false,
    keyboardHeight: 0,
  });

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const handleKeyboardShow = (event: KeyboardEvent) => {
      setKeyboardState({
        isKeyboardVisible: true,
        keyboardHeight: event.endCoordinates.height,
      });
    };

    const handleKeyboardHide = () => {
      setKeyboardState({
        isKeyboardVisible: false,
        keyboardHeight: 0,
      });
    };

    const showSubscription = Keyboard.addListener(showEvent, handleKeyboardShow);
    const hideSubscription = Keyboard.addListener(hideEvent, handleKeyboardHide);

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return keyboardState;
}

