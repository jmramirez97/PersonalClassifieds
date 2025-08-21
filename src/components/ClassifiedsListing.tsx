import { useState, useEffect } from 'react';
import { Plus, Star } from 'lucide-react';
import { AdCard } from './AdCard';
import { SearchAndFilter } from './SearchAndFilter';
import { CreateAdForm } from './CreateAdForm';
import type { ClassifiedAd, Category, AdFilter } from '../types/classifieds';

interface ClassifiedsListingProps {
  onContact?: (ad: ClassifiedAd) => void;
  onShare?: (ad: ClassifiedAd) => void;
}

export function ClassifiedsListing({ onContact, onShare }: ClassifiedsListingProps) {
  const [ads, setAds] = useState<ClassifiedAd[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filter, setFilter] = useState<AdFilter>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Mock data for demonstration - replace with actual SharePoint service calls
  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = async () => {
    try {
      setIsLoading(true);
      
      // Mock categories
      const mockCategories: Category[] = [
        { id: '1', name: 'Electronics', description: 'Electronic devices and gadgets', icon: '📱' },
        { id: '2', name: 'Furniture', description: 'Home and office furniture', icon: '🪑' },
        { id: '3', name: 'Clothing', description: 'Apparel and accessories', icon: '👕' },
        { id: '4', name: 'Books', description: 'Books and publications', icon: '📚' },
        { id: '5', name: 'Sports', description: 'Sports equipment and gear', icon: '⚽' },
        { id: '6', name: 'Automotive', description: 'Car parts and accessories', icon: '🚗' },
        { id: '7', name: 'Home & Garden', description: 'Home improvement and garden items', icon: '🏠' },
        { id: '8', name: 'Other', description: 'Miscellaneous items', icon: '📦' }
      ];
      setCategories(mockCategories);

      // Mock ads
      const mockAds: ClassifiedAd[] = [
        {
          id: '1',
          title: 'MacBook Pro 13" 2020 - Excellent Condition',
          description: 'Selling my MacBook Pro 13" from 2020. Intel i5, 16GB RAM, 512GB SSD. Perfect for work or school. Comes with original charger and case.',
          category: 'Electronics',
          price: 800,
          originalPrice: 1200,
          status: 'Active',
          images: ['https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=MacBook+Pro'],
          viewCount: 45,
          isFeatured: true,
          isLookingFor: false,
          createdBy: 'john.doe@company.com',
          createdDate: '2024-01-15T10:00:00Z',
          updatedDate: '2024-01-15T10:00:00Z',
          location: 'Building A, Floor 2',
          condition: 'Good',
          tags: ['laptop', 'apple', 'macbook', 'computer']
        },
        {
          id: '2',
          title: 'Office Chair - Herman Miller Aeron',
          description: 'High-quality office chair in great condition. Adjustable height, lumbar support, and mesh back for breathability.',
          category: 'Furniture',
          price: 350,
          originalPrice: 0,
          status: 'Active',
          images: ['https://via.placeholder.com/400x300/10B981/FFFFFF?text=Office+Chair'],
          viewCount: 23,
          isFeatured: false,
          isLookingFor: false,
          createdBy: 'jane.smith@company.com',
          createdDate: '2024-01-14T14:30:00Z',
          updatedDate: '2024-01-14T14:30:00Z',
          location: 'Building B, Floor 1',
          condition: 'Like New',
          tags: ['chair', 'office', 'ergonomic', 'herman-miller']
        },
        {
          id: '3',
          title: 'Looking for: Mountain Bike',
          description: 'I\'m looking for a mountain bike for weekend trail riding. Prefer something in good condition, size L or XL. Budget around $300-500.',
          category: 'Sports',
          price: 0,
          originalPrice: 0,
          status: 'Active',
          images: [],
          viewCount: 12,
          isFeatured: false,
          isLookingFor: true,
          createdBy: 'mike.wilson@company.com',
          createdDate: '2024-01-13T09:15:00Z',
          updatedDate: '2024-01-13T09:15:00Z',
          location: 'Building C, Floor 3',
          condition: 'Good',
          tags: ['bike', 'mountain', 'cycling', 'outdoor']
        },
        {
          id: '4',
          title: 'Nike Running Shoes - Size 10',
          description: 'Nike Air Zoom Pegasus 38 running shoes. Only worn a few times, too small for me. Great for running or casual wear.',
          category: 'Clothing',
          price: 60,
          originalPrice: 120,
          status: 'Active',
          images: ['https://via.placeholder.com/400x300/F59E0B/FFFFFF?text=Running+Shoes'],
          viewCount: 18,
          isFeatured: false,
          isLookingFor: false,
          createdBy: 'sarah.jones@company.com',
          createdDate: '2024-01-12T16:45:00Z',
          updatedDate: '2024-01-12T16:45:00Z',
          location: 'Building A, Floor 1',
          condition: 'Like New',
          tags: ['shoes', 'nike', 'running', 'athletic']
        },
        {
          id: '5',
          title: 'JavaScript: The Definitive Guide',
          description: 'O\'Reilly JavaScript book in excellent condition. Perfect for developers learning or improving their JS skills.',
          category: 'Books',
          price: 25,
          originalPrice: 0,
          status: 'Active',
          images: ['https://via.placeholder.com/400x300/EF4444/FFFFFF?text=JavaScript+Book'],
          viewCount: 8,
          isFeatured: false,
          isLookingFor: false,
          createdBy: 'david.brown@company.com',
          createdDate: '2024-01-11T11:20:00Z',
          updatedDate: '2024-01-11T11:20:00Z',
          location: 'Building B, Floor 2',
          condition: 'Good',
          tags: ['book', 'javascript', 'programming', 'oreilly']
        }
      ];
      setAds(mockAds);
    } catch (error) {
      setError('Failed to load classifieds data');
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilter: AdFilter) => {
    setFilter(newFilter);
    // In a real app, you would apply the filter to your data source
    // For now, we'll just update the local state
  };

  const handleToggleFavorite = (adId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(adId)) {
        newFavorites.delete(adId);
      } else {
        newFavorites.add(adId);
      }
      return newFavorites;
    });
  };

  const handleContact = (ad: ClassifiedAd) => {
    if (onContact) {
      onContact(ad);
    } else {
      // Default contact behavior
      alert(`Contact ${ad.createdBy} about "${ad.title}"`);
    }
  };

  const handleShare = (ad: ClassifiedAd) => {
    if (onShare) {
      onShare(ad);
    } else {
      // Default share behavior
      const shareUrl = `${window.location.origin}/ad/${ad.id}`;
      navigator.share?.({ title: ad.title, url: shareUrl }) || 
      navigator.clipboard.writeText(shareUrl).then(() => alert('Link copied to clipboard!'));
    }
  };

  const handleCreateAd = (ad: ClassifiedAd) => {
    // In a real app, you would save this to SharePoint
    setAds(prev => [ad, ...prev]);
    setShowCreateForm(false);
  };

  const getFilteredAds = () => {
    let filtered = [...ads];

    // Apply search filter
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      filtered = filtered.filter(ad => 
        ad.title.toLowerCase().includes(searchLower) ||
        ad.description.toLowerCase().includes(searchLower) ||
        ad.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply category filter
    if (filter.category) {
      filtered = filtered.filter(ad => ad.category === filter.category);
    }

    // Apply status filter
    if (filter.status) {
      filtered = filtered.filter(ad => ad.status === filter.status);
    }

    // Apply condition filter
    if (filter.condition) {
      filtered = filtered.filter(ad => ad.condition === filter.condition);
    }

    // Apply price filters
    if (filter.minPrice !== undefined) {
      filtered = filtered.filter(ad => ad.price >= filter.minPrice!);
    }
    if (filter.maxPrice !== undefined) {
      filtered = filtered.filter(ad => ad.price <= filter.maxPrice!);
    }

    // Apply location filter
    if (filter.location) {
      const locationLower = filter.location.toLowerCase();
      filtered = filtered.filter(ad => 
        ad.location?.toLowerCase().includes(locationLower)
      );
    }

    // Apply sorting
    switch (filter.sortBy) {
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime());
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        filtered.sort((a, b) => b.viewCount - a.viewCount);
        break;
      default: // newest
        filtered.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
    }

    return filtered;
  };

  const filteredAds = getFilteredAds();
  const featuredAds = filteredAds.filter(ad => ad.isFeatured);
  const regularAds = filteredAds.filter(ad => !ad.isFeatured);

  if (showCreateForm) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <button
          onClick={() => setShowCreateForm(false)}
          className="mb-4 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          ← Back to Listings
        </button>
        <CreateAdForm onSave={handleCreateAd} />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading classifieds...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
          <button
            onClick={loadMockData}
            className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Classifieds</h1>
          <p className="text-gray-600">Buy, sell, and exchange items with your colleagues</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="mt-4 sm:mt-0 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          <Plus className="h-5 w-5 inline mr-2" />
          Post New Ad
        </button>
      </div>

      {/* Search and Filters */}
      <SearchAndFilter
        onFilterChange={handleFilterChange}
        categories={categories}
        currentFilter={filter}
      />

      {/* Featured Ads Section */}
      {featuredAds.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Star className="h-6 w-6 text-yellow-500 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Featured Ads</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredAds.map(ad => (
              <AdCard
                key={ad.id}
                ad={ad}
                isFavorite={favorites.has(ad.id)}
                onToggleFavorite={handleToggleFavorite}
                onContact={handleContact}
                onShare={handleShare}
              />
            ))}
          </div>
        </div>
      )}

      {/* Regular Ads Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            All Listings ({regularAds.length})
          </h2>
          {regularAds.length > 0 && (
            <div className="text-sm text-gray-600">
              Showing {regularAds.length} of {ads.length} ads
            </div>
          )}
        </div>

        {regularAds.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No ads found</h3>
            <p className="text-gray-600 mb-4">
              {filter.search || Object.values(filter).some(v => v !== undefined && v !== '' && v !== 0)
                ? 'Try adjusting your search or filters'
                : 'Be the first to post an ad!'
              }
            </p>
            {!filter.search && !Object.values(filter).some(v => v !== undefined && v !== '' && v !== 0) && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <Plus className="h-5 w-5 inline mr-2" />
                Post First Ad
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {regularAds.map(ad => (
              <AdCard
                key={ad.id}
                ad={ad}
                isFavorite={favorites.has(ad.id)}
                onToggleFavorite={handleToggleFavorite}
                onContact={handleContact}
                onShare={handleShare}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
