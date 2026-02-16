import { useState, useEffect, useCallback, useRef } from 'react';

export function useAIPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const lastToggleRef = useRef<number>(0);

  useEffect(() => {
    const saved = localStorage.getItem('ai_panel_open');
    if (saved === 'true') setIsOpen(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('ai_panel_open', String(isOpen));
  }, [isOpen]);

  const togglePanel = useCallback(() => {
    const now = Date.now();
    if (now - lastToggleRef.current < 200) return;
    lastToggleRef.current = now;
    setIsOpen(prev => !prev);
    setIsMinimized(false);
  }, []);

  const openPanel = useCallback(() => {
    setIsOpen(true);
    setIsMinimized(false);
  }, []);

  const closePanel = useCallback(() => {
    setIsOpen(false);
    setIsMinimized(false);
  }, []);

  const minimizePanel = useCallback(() => {
    setIsMinimized(true);
  }, []);

  const restorePanel = useCallback(() => {
    setIsMinimized(false);
  }, []);

  return { isOpen, isMinimized, togglePanel, openPanel, closePanel, minimizePanel, restorePanel };
}
