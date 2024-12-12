import { Draggable } from '@hello-pangea/dnd';
import { KanbanColumn as IKanbanColumn } from '@/types';
import { ProductCard } from './ProductCard';
import { FaTrash } from 'react-icons/fa';

interface Props {
  column: IKanbanColumn;
  provided: any;
  onDeleteCategory?: (id: string) => void;
  isDeletable?: boolean;
}

export function KanbanColumn({ column, provided, onDeleteCategory, isDeletable = true }: Props) {
  return (
    <div
      ref={provided.innerRef}
      {...provided.droppableProps}
      className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg min-w-[300px] w-full"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{column.title}</h2>
        {isDeletable && column.id !== 'uncategorized' && onDeleteCategory && (
          <button
            onClick={() => onDeleteCategory(column.id)}
            className="p-2 text-red-500 hover:text-red-600 transition-colors"
            aria-label={`Delete ${column.title} category`}
          >
            <FaTrash className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="flex flex-col gap-2">
        {column.products.map((product, index) => (
          <Draggable key={product.id} draggableId={product.id} index={index}>
            {(provided) => (
              <ProductCard product={product} provided={provided} />
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </div>
    </div>
  );
}