import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Plus, Tag } from 'lucide-react';
import type { ClassifiedAd, Category } from '../types/classifieds';

interface CreateAdFormProps {
  editAd?: ClassifiedAd;
  onSave?: (ad: ClassifiedAd) => void;
}

export function CreateAdForm({ editAd, onSave }: CreateAdFormProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: editAd?.title || '',
    description: editAd?.description || '',
    category: editAd?.category || '',
    price: editAd?.price || 0,
    originalPrice: editAd?.originalPrice || 0,
    location: editAd?.location || '',
    condition: editAd?.condition || 'Good' as const,
    isLookingFor: editAd?.isLookingFor || false,
    tags: editAd?.tags || []
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<File[]>(editAd?.images ? [] : []);
  const [existingImages, setExistingImages] = useState<string[]>(editAd?.images || []);
  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      // This would be loaded from your SharePoint service
      const defaultCategories: Category[] = [
        { id: '1', name: 'Electronics', description: 'Electronic devices and gadgets', icon: '📱' },
        { id: '2', name: 'Furniture', description: 'Home and office furniture', icon: '🪑' },
        { id: '3', name: 'Clothing', description: 'Apparel and accessories', icon: '👕' },
        { id: '4', name: 'Books', description: 'Books and publications', icon: '📚' },
        { id: '5', name: 'Sports', description: 'Sports equipment and gear', icon: '⚽' },
        { id: '6', name: 'Automotive', description: 'Car parts and accessories', icon: '🚗' },
        { id: '7', name: 'Home & Garden', description: 'Home improvement and garden items', icon: '🏠' },
        { id: '8', name: 'Other', description: 'Miscellaneous items', icon: '📦' }
      ];
      setCategories(defaultCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(tag => tag !== tagToRemove) }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.category) {
        throw new Error('Please fill in all required fields');
      }

      if (formData.price < 0) {
        throw new Error('Price cannot be negative');
      }

      if (formData.originalPrice > 0 && formData.originalPrice <= formData.price) {
        throw new Error('Original price must be greater than current price');
      }

      // Create or update ad
      const adData = {
        ...formData,
        status: editAd?.status || 'Active',
        images: [...existingImages],
        createdBy: editAd?.createdBy || 'current-user-id', // This would come from MSAL
        isFeatured: editAd?.isFeatured || false
      };

      if (editAd) {
        // Update existing ad
        if (onSave) {
          onSave({ ...editAd, ...adData });
        }
      } else {
        // Create new ad
        if (onSave) {
          const newAd: ClassifiedAd = {
            id: '',
            ...adData,
            viewCount: 0,
            createdDate: new Date().toISOString(),
            updatedDate: new Date().toISOString()
          };
          onSave(newAd);
        }
      }

      // Navigate to the ad view or home
      navigate('/');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">
        {editAd ? 'Edit Ad' : 'Create New Ad'}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter item title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your item in detail"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condition
              </label>
              <select
                value={formData.condition}
                onChange={(e) => handleInputChange('condition', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Price *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Original Price
              </label>
              <input
                type="number"
                value={formData.originalPrice}
                onChange={(e) => handleInputChange('originalPrice', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Building A, Floor 3"
            />
          </div>
        </div>

        {/* Looking For Toggle */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isLookingFor"
            checked={formData.isLookingFor}
            onChange={(e) => handleInputChange('isLookingFor', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isLookingFor" className="text-sm font-medium text-gray-700">
            This is a "Looking For" post
          </label>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add a tag"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            />
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Images
          </label>
          
          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Existing Images:</p>
              <div className="grid grid-cols-3 gap-2">
                {existingImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Existing ${index + 1}`}
                      className="w-full h-24 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Image Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-2">
              <label htmlFor="image-upload" className="cursor-pointer">
                <span className="text-blue-600 hover:text-blue-500 font-medium">
                  Click to upload
                </span>
                <span className="text-gray-500"> or drag and drop</span>
              </label>
              <input
                id="image-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, GIF up to 10MB each
            </p>
          </div>

          {/* Preview Uploaded Images */}
          {images.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">New Images:</p>
              <div className="grid grid-cols-3 gap-2">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : (editAd ? 'Update Ad' : 'Create Ad')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
