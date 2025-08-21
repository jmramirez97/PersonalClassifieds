import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Eye, MessageCircle, Share2, Tag } from 'lucide-react';
import type { ClassifiedAd } from '../types/classifieds';

interface AdCardProps {
  ad: ClassifiedAd;
  isFavorite?: boolean;
  onToggleFavorite?: (adId: string) => void;
  onContact?: (ad: ClassifiedAd) => void;
  onShare?: (ad: ClassifiedAd) => void;
  showActions?: boolean;
}

export function AdCard({ 
  ad, 
  isFavorite = false, 
  onToggleFavorite, 
  onContact, 
  onShare,
  showActions = true 
}: AdCardProps) {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Sold':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'New':
        return 'bg-blue-100 text-blue-800';
      case 'Like New':
        return 'bg-green-100 text-green-800';
      case 'Good':
        return 'bg-yellow-100 text-yellow-800';
      case 'Fair':
        return 'bg-orange-100 text-orange-800';
      case 'Poor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCardClick = () => {
    navigate(`/ad/${ad.id}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(ad.id);
    }
  };

  const handleContactClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onContact) {
      onContact(ad);
    }
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onShare) {
      onShare(ad);
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer overflow-hidden"
      onClick={handleCardClick}
    >
      {/* Image Section */}
      <div className="relative h-48 bg-gray-100">
        {ad.images.length > 0 && !imageError ? (
          <img
            src={ad.images[0]}
            alt={ad.title}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-4xl mb-2">📷</div>
              <div className="text-sm">No Image</div>
            </div>
          </div>
        )}
        
        {/* Status Badge */}
        <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ad.status)}`}>
          {ad.status}
        </div>

        {/* Featured Badge */}
        {ad.isFeatured && (
          <div className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            ⭐ Featured
          </div>
        )}

        {/* Looking For Badge */}
        {ad.isLookingFor && (
          <div className="absolute bottom-2 left-2 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            🔍 Looking For
          </div>
        )}

        {/* Image Count Badge */}
        {ad.images.length > 1 && (
          <div className="absolute bottom-2 right-2 px-2 py-1 rounded-full text-xs font-medium bg-black bg-opacity-50 text-white">
            +{ad.images.length - 1} more
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Title and Category */}
        <div className="mb-2">
          <h3 className="font-semibold text-gray-900 text-lg line-clamp-2 mb-1">
            {ad.title}
          </h3>
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2">{ad.category}</span>
            {ad.location && (
              <>
                <span className="mx-1">•</span>
                <span>{ad.location}</span>
              </>
            )}
          </div>
        </div>

        {/* Price Section */}
        <div className="mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-green-600">
              {formatPrice(ad.price)}
            </span>
            {ad.originalPrice && ad.originalPrice > ad.price && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(ad.originalPrice)}
              </span>
            )}
          </div>
          {ad.condition && (
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(ad.condition)}`}>
              {ad.condition}
            </span>
          )}
        </div>

        {/* Tags */}
        {ad.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {ad.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </span>
            ))}
            {ad.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{ad.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Stats and Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              {ad.viewCount} views
            </div>
            <div className="text-xs">
              {new Date(ad.createdDate).toLocaleDateString()}
            </div>
          </div>

          {showActions && (
            <div className="flex items-center space-x-2">
              {/* Favorite Button */}
              <button
                onClick={handleFavoriteClick}
                className={`p-2 rounded-full transition-colors ${
                  isFavorite 
                    ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                    : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                }`}
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
              </button>

              {/* Contact Button */}
              <button
                onClick={handleContactClick}
                className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                title="Contact seller"
              >
                <MessageCircle className="h-4 w-4" />
              </button>

              {/* Share Button */}
              <button
                onClick={handleShareClick}
                className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-full transition-colors"
                title="Share ad"
              >
                <Share2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
