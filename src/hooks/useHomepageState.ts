import { useState, useCallback, useEffect, useRef } from 'react';

export type UIState = 'idle' | 'engaged' | 'validated';

interface UseHomepageStateOptions {
  fromZip: string;
  toZip: string;
  fromCity: string;
  toCity: string;
}

export function useHomepageState({ fromZip, toZip, fromCity, toCity }: UseHomepageStateOptions) {
  const [uiState, setUIState] = useState<UIState>('idle');
  const hasEngaged = useRef(false);
  const hasValidated = useRef(false);

  // ENGAGED: triggered when user types first character in any route input
  const handleInputChange = useCallback(() => {
    if (!hasEngaged.current && uiState === 'idle') {
      hasEngaged.current = true;
      setUIState('engaged');
    }
  }, [uiState]);

  // VALIDATED: triggered when first city/ZIP validates successfully
  useEffect(() => {
    if (!hasValidated.current && (fromCity || toCity)) {
      hasValidated.current = true;
      setUIState('validated');
    }
  }, [fromCity, toCity]);

  // Check if inputs have content (for engaged state detection)
  useEffect(() => {
    if (!hasEngaged.current && (fromZip.length > 0 || toZip.length > 0)) {
      hasEngaged.current = true;
      setUIState('engaged');
    }
  }, [fromZip, toZip]);

  return {
    uiState,
    handleInputChange,
    isIdle: uiState === 'idle',
    isEngaged: uiState === 'engaged',
    isValidated: uiState === 'validated',
  };
}
