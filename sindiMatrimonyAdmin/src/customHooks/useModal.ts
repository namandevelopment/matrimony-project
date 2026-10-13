import { useState, useCallback } from 'react';

export interface UseModalReturn<T = unknown> {
  isOpen: boolean;
  data: T | null;
  openModal: (data?: T) => void;
  closeModal: () => void;
  toggleModal: () => void;
  setData: React.Dispatch<React.SetStateAction<T | null>>;
}

/**
 * Universal hook for managing modal visibility, open/close lifecycle, and associated payload data.
 */
export function useModal<T = unknown>(initialOpen = false, initialData: T | null = null): UseModalReturn<T> {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [data, setData] = useState<T | null>(initialData);

  const openModal = useCallback((modalData?: T) => {
    if (modalData !== undefined) {
      setData(modalData);
    }
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleModal = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return {
    isOpen,
    data,
    openModal,
    closeModal,
    toggleModal,
    setData,
  };
}
