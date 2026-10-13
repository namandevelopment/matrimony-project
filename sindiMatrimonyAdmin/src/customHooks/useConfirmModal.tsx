import { useState, useCallback, useMemo, useRef } from 'react';
import React from 'react';
import { ConfirmModal, type ConfirmVariant } from '../customModals/ConfirmModal';

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmVariant;
}

export interface UseConfirmModalReturn {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  isOpen: boolean;
  ConfirmModalComponent: React.ReactElement | null;
}

/**
 * Promise-based confirmation popup hook.
 * Allows awaiting user confirmation synchronously inside any button handler.
 */
export function useConfirmModal(): UseConfirmModalReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({
    title: 'Are you sure?',
    message: 'Please confirm this action.',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    variant: 'danger',
  });

  const resolverRef = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    setOptions(opts);
    setIsOpen(true);
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const handleConfirm = useCallback(() => {
    setIsOpen(false);
    if (resolverRef.current) {
      resolverRef.current(true);
      resolverRef.current = null;
    }
  }, []);

  const handleCancel = useCallback(() => {
    setIsOpen(false);
    if (resolverRef.current) {
      resolverRef.current(false);
      resolverRef.current = null;
    }
  }, []);

  const ConfirmModalComponent = useMemo(() => {
    if (!isOpen) return null;
    return (
      <ConfirmModal
        isOpen={isOpen}
        title={options.title}
        message={options.message}
        confirmText={options.confirmText}
        cancelText={options.cancelText}
        variant={options.variant || 'danger'}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    );
  }, [isOpen, options, handleConfirm, handleCancel]);

  return {
    confirm,
    isOpen,
    ConfirmModalComponent,
  };
}
