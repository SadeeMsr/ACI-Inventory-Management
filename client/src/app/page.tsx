'use client';

import { useState } from 'react';

import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary';
import { Navbar } from '@/components/common/Navbar';
import { Analytics } from '@/components/Analytics/Analytics';
import { KanbanBoard } from '@/components/KanbanBoard/KanbanBoard';
import { CategoryModal } from '@/components/Category/CategoryModal';
import { BarcodeScanner } from '@/components/BarcodeScanner/BarcodeScanner';



export default function Home() {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  useKeyboardShortcuts({
    onOpenCategoryModal: () => setIsCategoryModalOpen(true),
    onOpenScanner: () => setIsScannerOpen(true)
  });

  return (
    <ErrorBoundary  >
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar onOpenScanner={() => setIsScannerOpen(true)} />
        <main>
          <Analytics />
          <KanbanBoard />
          <BarcodeScanner
            isOpen={isScannerOpen}
            onClose={() => setIsScannerOpen(false)}
          />
        </main>
      </div>
    </ErrorBoundary>
  );
}
