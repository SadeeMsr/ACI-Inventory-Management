import { useEffect } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { productFilterVar } from '@/lib/apollo';

export function useKeyboardShortcuts({
  onOpenCategoryModal,
  onOpenScanner
}: {
  onOpenCategoryModal: () => void;
  onOpenScanner: () => void;
}) {
  useHotkeys('/', (event) => {
    event.preventDefault();
    const searchInput = document.querySelector<HTMLInputElement>('[data-search-input]');
    searchInput?.focus();
  });

  useHotkeys('c', () => {
    onOpenCategoryModal();
  });

  useHotkeys('b', () => {
    onOpenScanner();
  });

  useHotkeys('esc', () => {
    productFilterVar({ search: '', category: '', status: '' });
  });
} 