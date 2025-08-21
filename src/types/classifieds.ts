export interface ClassifiedAd {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  originalPrice?: number;
  status: 'Active' | 'Pending' | 'Sold';
  images: string[];
  viewCount: number;
  isFeatured: boolean;
  isLookingFor: boolean;
  createdBy: string;
  createdDate: string;
  updatedDate: string;
  location?: string;
  condition?: 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor';
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  department?: string;
  location?: string;
  avatar?: string;
}

export interface Favorite {
  id: string;
  userId: string;
  adId: string;
  addedDate: string;
}

export interface SavedSearch {
  id: string;
  userId: string;
  name: string;
  query: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  isActive: boolean;
  createdDate: string;
}

export interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  adId: string;
  subject: string;
  content: string;
  sentDate: string;
  isRead: boolean;
}

export interface AdFilter {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  condition?: string;
  location?: string;
  sortBy?: 'newest' | 'oldest' | 'price-low' | 'price-high' | 'popular';
}
