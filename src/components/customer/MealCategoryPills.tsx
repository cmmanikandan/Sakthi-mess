'use client';

import React from 'react';
import { MealCategory } from '@/types';
import { useCanteen } from '@/context/CanteenContext';

interface MealCategoryPillsProps {
  selectedCategory: MealCategory;
  onSelectCategory: (category: MealCategory) => void;
}

export function MealCategoryPills({
  selectedCategory,
  onSelectCategory,
}: MealCategoryPillsProps) {
  const { categories } = useCanteen();

  const allCategories: { id: MealCategory; label: string; icon: string }[] = [
    { id: 'all', label: 'All Dishes', icon: '🍽️' },
    ...categories.map((c) => ({
      id: c.id as MealCategory,
      label: c.name,
      icon: c.icon,
    })),
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 px-0.5">
      {allCategories.map((cat) => {
        const isSelected = selectedCategory === cat.id;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${
              isSelected
                ? 'bg-[#E23744] text-white border-[#E23744] shadow-xs'
                : 'bg-white text-[#696969] border-[#E8E8E8] hover:border-stone-300 hover:text-[#1C1C1C] hover:bg-stone-50'
            }`}
          >
            <span className="text-sm">{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
