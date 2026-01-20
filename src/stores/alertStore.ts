import { create } from 'zustand';

interface AlertState {
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: (() => void) | null;
  onCancel: (() => void) | null;

  openConfirm: (options: {
    title: string;
    description: string;
    onConfirm: () => void;
    onCancel?: () => void;
  }) => void;
  close: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  isOpen: false,
  title: '',
  description: '',
  onConfirm: null,
  onCancel: null,

  openConfirm: ({ title, description, onConfirm, onCancel }) => {
    set({
      isOpen: true,
      title,
      description,
      onConfirm,
      onCancel: onCancel || null,
    });
  },

  close: () => {
    set({
      isOpen: false,
      title: '',
      description: '',
      onConfirm: null,
      onCancel: null,
    });
  },
}));
