import { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import type { Category, AdFilter } from '../types/classifieds';

interface SearchAndFilterProps {
  onFilterChange: (filter: AdFilter) => void;
  categories: Category[];
  currentFilter: AdFilter;
}

export function SearchAndFilter({ onFilterChange, categories, currentFilter }: SearchAndFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [localFilter, setLocalFilter] = useState<AdFilter>(currentFilter);

  useEffect(() => {
    setLocalFilter(currentFilter);
  }, [currentFilter]);

  const handleFilterChange = (field: keyof AdFilter, value: any) => {
    const newFilter = { ...localFilter, [field]: value };
    setLocalFilter(newFilter);
    onFilterChange(newFilter);
  };

  const handleSearchChange = (value: string) => {
    handleFilterChange('search', value);
  };

  const clearFilters = () => {
    const clearedFilter: AdFilter = {};
    setLocalFilter(clearedFilter);
    onFilterChange(clearedFilter);
  };

  const hasActiveFilters = Object.values(currentFilter).some(value => 
    value !== undefined && value !== '' && value !== 0
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      {/* Search Bar */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search ads by title, description, or tags..."
            value={localFilter.search || ''}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`px-4 py-2 rounded-lg border transition-colors ${
            isFilterOpen 
              ? 'bg-blue-50 border-blue-300 text-blue-700' 
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Filter className="h-4 w-4 inline mr-2" />
          Filters
          {hasActiveFilters && (
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 bg-blue-500 text-white text-xs rounded-full">
              {Object.values(currentFilter).filter(v => v !== undefined && v !== '' && v !== 0).length}
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-4 w-4 inline mr-1" />
            Clear
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {isFilterOpen && (
        <div className="border-t pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={localFilter.category || ''}
                onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={localFilter.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Sold">Sold</option>
              </select>
            </div>

            {/* Condition Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condition
              </label>
              <select
                value={localFilter.condition || ''}
                onChange={(e) => handleFilterChange('condition', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Conditions</option>
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={localFilter.sortBy || 'newest'}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>

          {/* Price Range */}
          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Price Range
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Min Price</label>
                <input
                  type="number"
                  placeholder="0"
                  value={localFilter.minPrice || ''}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Max Price</label>
                <input
                  type="number"
                  placeholder="No limit"
                  value={localFilter.maxPrice || ''}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {/* Location Filter */}
          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              placeholder="Enter location..."
              value={localFilter.location || ''}
              onChange={(e) => handleFilterChange('location', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="border-t pt-4">
              <div className="flex flex-wrap gap-2">
                {Object.entries(currentFilter).map(([key, value]) => {
                  if (value === undefined || value === '' || value === 0) return null;
                  
                  let displayValue = value;
                  if (key === 'sortBy') {
                    const sortLabels: Record<string, string> = {
                      'newest': 'Newest First',
                      'oldest': 'Oldest First',
                      'price-low': 'Price: Low to High',
                      'price-high': 'Price: High to Low',
                      'popular': 'Most Popular'
                    };
                    displayValue = sortLabels[value as string] || value;
                  }

                  return (
                    <span
                      key={key}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {key === 'search' ? '🔍' : key === 'category' ? '📂' : key === 'status' ? '🏷️' : 
                       key === 'condition' ? '⭐' : key === 'sortBy' ? '↕️' : key === 'minPrice' ? '💰' : 
                       key === 'maxPrice' ? '💰' : key === 'location' ? '📍' : '•'} {displayValue}
                      <button
                        onClick={() => handleFilterChange(key as keyof AdFilter, undefined)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
