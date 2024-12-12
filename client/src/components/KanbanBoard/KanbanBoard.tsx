'use client';

import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { useState } from 'react';
import { useKanbanBoard } from '@/hooks/useKanbanBoard';
import { KanbanColumn } from './KanbanColumn';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import { ErrorBoundary } from '../ErrorBoundary/ErrorBoundary';
import { CategoryModal } from '../Category/CategoryModal';

import { FaCog } from 'react-icons/fa';

export function KanbanBoard() {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const { columns, loading, error, handleDragEnd, handleDeleteCategory } = useKanbanBoard();

  if (loading) return <LoadingSpinner />;
  if (error) return <p className='text-red-500'>Error loading kanban board</p>;

  return (
    <ErrorBoundary>
      <div className="p-4">
      <div className="flex justify-end mb-4">
         <button
           onClick={() => setIsCategoryModalOpen(true)}
           className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
           aria-label="Manage Categories"
         >
           <FaCog className="w-4 h-4" />
           <span>Manage Categories</span>
         </button>
       </div>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {columns.map(column => (
              <Droppable key={column.id} droppableId={column.id}>
                {(provided) => (
                  <KanbanColumn
                    column={column}
                    provided={provided}
                    onDeleteCategory={handleDeleteCategory}
                    isDeletable={column.id !== 'uncategorized'}
                  />
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
        <CategoryModal
          isOpen={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
        />
      </div>
    </ErrorBoundary>
  );
} 