import { Client } from "@microsoft/microsoft-graph-client";
import type { ClassifiedAd, Category, Favorite, AdFilter } from "../types/classifieds";

export class SharePointService {
  private client: Client;
  private siteId: string;
  private listIds: {
    ads: string;
    categories: string;
    users: string;
    favorites: string;
    savedSearches: string;
    messages: string;
  };

  constructor(client: Client, siteId: string, listIds: any) {
    this.client = client;
    this.siteId = siteId;
    this.listIds = listIds;
  }

  // Initialize SharePoint lists if they don't exist
  async initializeLists(): Promise<void> {
    try {
      // Create lists if they don't exist
      await this.createListIfNotExists('ClassifiedAds', 'Classified Ads');
      await this.createListIfNotExists('Categories', 'Categories');
      await this.createListIfNotExists('Users', 'Users');
      await this.createListIfNotExists('Favorites', 'Favorites');
      await this.createListIfNotExists('SavedSearches', 'Saved Searches');
      await this.createListIfNotExists('Messages', 'Messages');
    } catch (error) {
      console.error('Error initializing SharePoint lists:', error);
      throw error;
    }
  }

  private async createListIfNotExists(displayName: string, description: string): Promise<void> {
    try {
      await this.client
        .api(`/sites/${this.siteId}/lists/${displayName}`)
        .get();
      console.log(`List ${displayName} already exists`);
    } catch {
      // List doesn't exist, create it
      await this.client
        .api(`/sites/${this.siteId}/lists`)
        .post({
          displayName,
          description,
          columns: this.getListColumns(displayName),
          template: 'genericList'
        });
      console.log(`Created list: ${displayName}`);
    }
  }

  private getListColumns(listName: string): any[] {
    switch (listName) {
      case 'ClassifiedAds':
        return [
          { name: 'Title', displayName: 'Title', type: 'text' },
          { name: 'Description', displayName: 'Description', type: 'text' },
          { name: 'Category', displayName: 'Category', type: 'text' },
          { name: 'Price', displayName: 'Price', type: 'number' },
          { name: 'OriginalPrice', displayName: 'Original Price', type: 'number' },
          { name: 'Status', displayName: 'Status', type: 'choice', choices: ['Active', 'Pending', 'Sold'] },
          { name: 'Images', displayName: 'Images', type: 'text' },
          { name: 'ViewCount', displayName: 'View Count', type: 'number' },
          { name: 'IsFeatured', displayName: 'Is Featured', type: 'boolean' },
          { name: 'IsLookingFor', displayName: 'Is Looking For', type: 'boolean' },
          { name: 'CreatedBy', displayName: 'Created By', type: 'text' },
          { name: 'Location', displayName: 'Location', type: 'text' },
          { name: 'Condition', displayName: 'Condition', type: 'choice', choices: ['New', 'Like New', 'Good', 'Fair', 'Poor'] },
          { name: 'Tags', displayName: 'Tags', type: 'text' }
        ];
      case 'Categories':
        return [
          { name: 'Title', displayName: 'Name', type: 'text' },
          { name: 'Description', displayName: 'Description', type: 'text' },
          { name: 'Icon', displayName: 'Icon', type: 'text' }
        ];
      default:
        return [];
    }
  }

  // Classified Ads CRUD operations
  async createAd(ad: Omit<ClassifiedAd, 'id' | 'createdDate' | 'updatedDate' | 'viewCount'>): Promise<ClassifiedAd> {
    const now = new Date().toISOString();
    const adData = {
      ...ad,
      createdDate: now,
      updatedDate: now,
      viewCount: 0
    };

    const response = await this.client
      .api(`/sites/${this.siteId}/lists/${this.listIds.ads}/items`)
      .post({
        fields: adData
      });

    return this.mapSharePointItemToAd(response);
  }

  async updateAd(id: string, updates: Partial<ClassifiedAd>): Promise<ClassifiedAd> {
    const updateData = {
      ...updates,
      updatedDate: new Date().toISOString()
    };

    const response = await this.client
      .api(`/sites/${this.siteId}/lists/${this.listIds.ads}/items/${id}/fields`)
      .patch(updateData);

    return this.mapSharePointItemToAd(response);
  }

  async getAds(filter?: AdFilter): Promise<ClassifiedAd[]> {
    let query = `/sites/${this.siteId}/lists/${this.listIds.ads}/items?$expand=fields&$orderby=fields/CreatedDate desc`;
    
    if (filter?.search) {
      query += `&$filter=contains(fields/Title,'${filter.search}') or contains(fields/Description,'${filter.search}')`;
    }
    if (filter?.category) {
      query += `&$filter=fields/Category eq '${filter.category}'`;
    }
    if (filter?.status) {
      query += `&$filter=fields/Status eq '${filter.status}'`;
    }

    const response = await this.client.api(query).get();
    return response.value.map((item: any) => this.mapSharePointItemToAd(item));
  }

  async getAdById(id: string): Promise<ClassifiedAd> {
    const response = await this.client
      .api(`/sites/${this.siteId}/lists/${this.listIds.ads}/items/${id}?$expand=fields`)
      .get();
    
    return this.mapSharePointItemToAd(response);
  }

  async incrementViewCount(id: string): Promise<void> {
    const ad = await this.getAdById(id);
    await this.updateAd(id, { viewCount: ad.viewCount + 1 });
  }

  async deleteAd(id: string): Promise<void> {
    await this.client
      .api(`/sites/${this.siteId}/lists/${this.listIds.ads}/items/${id}`)
      .delete();
  }

  // Image upload functionality
  async uploadImage(file: File, adId: string): Promise<string> {
    const fileName = `${adId}_${Date.now()}_${file.name}`;
    
    const response = await this.client
      .api(`/sites/${this.siteId}/lists/${this.listIds.ads}/items/${adId}/driveItem/children/${fileName}/content`)
      .put(file);

    return response.webUrl || response.downloadUrl;
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    const response = await this.client
      .api(`/sites/${this.siteId}/lists/${this.listIds.categories}/items?$expand=fields`)
      .get();
    
    return response.value.map((item: any) => ({
      id: item.id,
      name: item.fields.Title,
      description: item.fields.Description,
      icon: item.fields.Icon
    }));
  }

  // Favorites
  async addToFavorites(userId: string, adId: string): Promise<Favorite> {
    const response = await this.client
      .api(`/sites/${this.siteId}/lists/${this.listIds.favorites}/items`)
      .post({
        fields: {
          UserId: userId,
          AdId: adId,
          AddedDate: new Date().toISOString()
        }
      });

    return {
      id: response.id,
      userId: response.fields.UserId,
      adId: response.fields.AdId,
      addedDate: response.fields.AddedDate
    };
  }

  async removeFromFavorites(userId: string, adId: string): Promise<void> {
    // Find and delete the favorite
    const response = await this.client
      .api(`/sites/${this.siteId}/lists/${this.listIds.favorites}/items?$filter=fields/UserId eq '${userId}' and fields/AdId eq '${adId}'`)
      .get();

    if (response.value.length > 0) {
      await this.client
        .api(`/sites/${this.siteId}/lists/${this.listIds.favorites}/items/${response.value[0].id}`)
        .delete();
    }
  }

  async getFavorites(userId: string): Promise<ClassifiedAd[]> {
    const response = await this.client
      .api(`/sites/${this.siteId}/lists/${this.listIds.favorites}/items?$filter=fields/UserId eq '${userId}'&$expand=fields`)
      .get();

    const favoriteAdIds = response.value.map((item: any) => item.fields.AdId);
    const ads = await Promise.all(favoriteAdIds.map((id: string) => this.getAdById(id)));
    return ads.filter(ad => ad.status === 'Active');
  }

  // Helper method to map SharePoint item to ClassifiedAd
  private mapSharePointItemToAd(item: any): ClassifiedAd {
    return {
      id: item.id,
      title: item.fields.Title,
      description: item.fields.Description,
      category: item.fields.Category,
      price: item.fields.Price,
      originalPrice: item.fields.OriginalPrice,
      status: item.fields.Status,
      images: item.fields.Images ? item.fields.Images.split(',') : [],
      viewCount: item.fields.ViewCount || 0,
      isFeatured: item.fields.IsFeatured || false,
      isLookingFor: item.fields.IsLookingFor || false,
      createdBy: item.fields.CreatedBy,
      createdDate: item.fields.CreatedDate,
      updatedDate: item.fields.UpdatedDate,
      location: item.fields.Location,
      condition: item.fields.Condition,
      tags: item.fields.Tags ? item.fields.Tags.split(',') : []
    };
  }
}
