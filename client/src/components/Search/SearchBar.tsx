'use client';

import { useState } from 'react';
import { FaSearch, FaFilter } from 'react-icons/fa';
import { useQuery } from '@apollo/client';
import { GET_CATEGORIES } from '@/graphql/queries';
import { debounce } from 'lodash';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  onFilterCategory: (category: string) => void;
  onFilterStatus: (status: string) => void;
}

export function SearchBar({ onSearch, onFilterCategory, onFilterStatus }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { data: categoriesData } = useQuery(GET_CATEGORIES);

  return (
    <div className="flex flex-col gap-4 mb-4 p-4 opacity-10 select-none pointer-events-none">
      {/* Search Input */}
      <div className="relative w-full">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search products... (Press '/' to focus)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-md border dark:bg-gray-700 dark:border-gray-600"
          data-search-input
          aria-label="Search input"
        />
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="md:hidden absolute right-2 top-1/2 transform -translate-y-1/2 p-2"
          aria-label="Toggle filters"
        >
          <FaFilter className="text-gray-400" />
        </button>
      </div>

      {/* Filters */}
      <div className={`flex flex-col md:flex-row gap-2 w-full md:w-auto ${isFilterOpen ? 'block' : 'hidden md:flex'}`}>
        <select
          onChange={(e) => onFilterCategory(e.target.value)}
          className="w-full md:w-auto px-4 py-2 rounded-md border dark:bg-gray-700 dark:border-gray-600"
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          {categoriesData?.categories.map((category: any) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => onFilterStatus(e.target.value)}
          className="w-full md:w-auto px-4 py-2 rounded-md border dark:bg-gray-700 dark:border-gray-600"
          aria-label="Filter by status"
        >
          <option value="">All Statuses</option>
          <option value="Uncategorized">Uncategorized</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>
    </div>
  );
} 