'use client';

import { Fragment, useState } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_CATEGORY } from '@/graphql/mutations';
import { GET_CATEGORIES, GET_ANALYTICS } from '@/graphql/queries';
import { toast } from 'react-hot-toast';
import { Category } from '@/types/index';


const schema = z.object({
  name: z.string().min(1, 'Category name is required')
});

type FormData = z.infer<typeof schema>;

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CategoryModal({ isOpen, onClose }: CategoryModalProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const { data: categoriesData } = useQuery(GET_CATEGORIES);
  
  const [createCategory] = useMutation(CREATE_CATEGORY, {
    update: (cache, { data }) => {
      const existingCategories = cache.readQuery<{ categories: Category[] }>({
        query: GET_CATEGORIES
      });

      if (existingCategories) {
        cache.writeQuery({
          query: GET_CATEGORIES,
          data: {
            categories: [...existingCategories.categories, data.createCategory]
          }
        });
      }

      // Update analytics
      const existingAnalytics = cache.readQuery<{ analytics: any }>({
        query: GET_ANALYTICS
      });

      if (existingAnalytics) {
        cache.writeQuery({
          query: GET_ANALYTICS,
          data: {
            analytics: {
              ...existingAnalytics.analytics,
              totalCategories: existingAnalytics.analytics.totalCategories + 1
            }
          }
        });
      }
    }
  });

  const onSubmit = async (data: FormData) => {
    try {
      await createCategory({
        variables: { name: data.name }
      });
      toast.success('Category created successfully');
      reset();
      onClose();
    } catch (error) {
      toast.error('Failed to create category');
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                >
                  Create New Category
                </DialogTitle>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
                  <div className="space-y-4">
                    <div>
                      <input
                        {...register('name')}
                        type="text"
                        placeholder="Category name"
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                      >
                        Create
                      </button>
                    </div>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
} 