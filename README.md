# Company Classifieds - SharePoint Embedded SPA

A modern, responsive web application for internal company classifieds built with React, TypeScript, and Microsoft Graph APIs. This application allows employees to buy, sell, and exchange personal items within a trusted company network.

## 🚀 Features

### Core Functionality
- **Create & Manage Ads**: Post new classified ads with images, descriptions, and pricing
- **Browse Listings**: View all available items with search and filtering capabilities
- **User Management**: Manage your own ads and track favorites
- **Contact Sellers**: Built-in messaging system for buyer-seller communication
- **Image Support**: Upload and manage multiple images per ad

### Advanced Features
- **Smart Search**: Search by title, description, tags, and more
- **Advanced Filtering**: Filter by category, price range, condition, location, and status
- **Featured Ads**: Highlighted listings for premium items
- **"Looking For" Posts**: Request items you need from colleagues
- **View Tracking**: Monitor how many people view your ads
- **Favorites System**: Save ads for later review
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

### SharePoint Integration
- **SharePoint Lists**: All data stored in SharePoint Embedded lists
- **Microsoft Graph API**: Full CRUD operations for ads, users, and interactions
- **Image Storage**: Secure image storage in SharePoint document libraries
- **User Authentication**: Azure AD integration with MSAL

## 🛠️ Technology Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom Components
- **Authentication**: Microsoft Authentication Library (MSAL)
- **Backend**: Microsoft Graph API + SharePoint Embedded
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Build Tool**: Vite

## 📋 Prerequisites

- Node.js 18+ and npm
- Azure Active Directory tenant
- SharePoint Online or SharePoint Embedded environment
- Microsoft 365 account with appropriate permissions

## 🔧 Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd sharepoint-embedded-spa
npm install
```

### 2. Azure AD App Registration

1. Go to [Azure Portal](https://portal.azure.com) → Azure Active Directory
2. Navigate to **App registrations** → **New registration**
3. Configure the app:
   - **Name**: Company Classifieds
   - **Supported account types**: Accounts in this organizational directory only
   - **Redirect URI**: Web → `http://localhost:5173`

4. **API Permissions** (Microsoft Graph):
   - `User.Read` (delegated)
   - `Sites.ReadWrite.All` (delegated)
   - `Sites.Manage.All` (delegated)
   - `User.ReadWrite.All` (delegated)
   - `Chat.ReadWrite` (delegated)
   - `ChatMessage.Send` (delegated)

5. **Grant admin consent** for the permissions

6. Copy the **Application (client) ID** and **Directory (tenant) ID**

### 3. Environment Configuration

Create a `.env.local` file in the project root:

```env
# Azure AD Configuration
VITE_AAD_CLIENT_ID=your_client_id_here
VITE_AAD_TENANT_ID=your_tenant_id_here
VITE_REDIRECT_URI=http://localhost:5173
VITE_POST_LOGOUT_URI=http://localhost:5173

# SharePoint Configuration (optional - can be configured in the app)
VITE_SHAREPOINT_SITE_ID=your_site_id_here
VITE_SHAREPOINT_LIST_IDS={"ads":"ClassifiedAds","categories":"Categories","users":"Users","favorites":"Favorites","savedSearches":"SavedSearches","messages":"Messages"}
```

### 4. SharePoint Site Setup

1. **Create a SharePoint site** (if not exists)
2. **Note the Site ID** from the URL: `https://yourtenant.sharepoint.com/sites/yoursite`
3. **Create the required lists** (the app will do this automatically on first run):
   - ClassifiedAds
   - Categories
   - Users
   - Favorites
   - SavedSearches
   - Messages

### 5. Run the Application

```bash
# Development mode
VITE_USE_MOCK=true npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173`

## 🏗️ Architecture

### Component Structure
```
src/
├── components/
│   ├── AdCard.tsx           # Individual ad display
│   ├── ClassifiedsListing.tsx # Main listing page
│   ├── CreateAdForm.tsx     # Ad creation/editing form
│   └── SearchAndFilter.tsx  # Search and filtering interface
├── services/
│   └── sharepointService.ts # SharePoint data operations
├── types/
│   └── classifieds.ts       # TypeScript interfaces
├── auth/
│   ├── msalConfig.ts        # MSAL configuration
│   └── MsalProviderWrapper.tsx # MSAL provider wrapper
└── App.tsx                  # Main application component
```

### Data Flow
1. **Authentication**: MSAL handles Azure AD authentication
2. **Graph Client**: Microsoft Graph client for API calls
3. **SharePoint Service**: Business logic for CRUD operations
4. **React Components**: UI components with state management
5. **TypeScript**: Type safety throughout the application

## 🔐 Security Features

- **Azure AD Authentication**: Enterprise-grade identity management
- **Delegated Permissions**: Users can only access their own data
- **Secure Image Storage**: Images stored in SharePoint with proper access controls
- **Input Validation**: Client and server-side validation
- **HTTPS Only**: Secure communication protocols

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Progressive Enhancement**: Enhanced experience on larger screens
- **Touch Friendly**: Optimized for touch interactions
- **Accessibility**: WCAG compliant design patterns

## 🚀 Deployment Options

### SharePoint Embedded
- Deploy as a SharePoint app
- Integrate with existing SharePoint sites
- Leverage SharePoint security and governance

### Teams App
- Package as a Microsoft Teams app
- Native Teams integration
- Single sign-on experience

### Standalone Web App
- Deploy to Azure Static Web Apps
- Custom domain support
- Global CDN distribution

## 🔧 Customization

### Adding New Categories
Update the categories in `src/components/ClassifiedsListing.tsx`:

```typescript
const mockCategories: Category[] = [
  // Add your custom categories here
  { id: '9', name: 'Custom Category', description: 'Description', icon: '🎯' }
];
```

### Modifying Ad Fields
Update the `ClassifiedAd` interface in `src/types/classifieds.ts` and the SharePoint service accordingly.

### Styling Changes
Modify `src/index.css` and `tailwind.config.js` for custom styling.

## 🐛 Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify Azure AD app registration
   - Check redirect URI configuration
   - Ensure admin consent is granted

2. **SharePoint Permission Errors**
   - Verify Graph API permissions
   - Check site access permissions
   - Ensure lists exist and are accessible

3. **Build Errors**
   - Clear node_modules and reinstall
   - Check TypeScript version compatibility
   - Verify all dependencies are installed

### Debug Mode

Enable debug logging in `src/auth/msalConfig.ts`:

```typescript
logLevel: LogLevel.Verbose, // Change from Warning to Verbose
```

## 📚 API Reference

### Microsoft Graph Endpoints Used
- `GET /sites/{site-id}/lists` - Retrieve SharePoint lists
- `POST /sites/{site-id}/lists` - Create new lists
- `GET /sites/{site-id}/lists/{list-id}/items` - Get list items
- `POST /sites/{site-id}/lists/{list-id}/items` - Create list items
- `PATCH /sites/{site-id}/lists/{list-id}/items/{item-id}/fields` - Update items
- `DELETE /sites/{site-id}/lists/{list-id}/items/{item-id}` - Delete items

### SharePoint List Schema

#### ClassifiedAds List
- Title (Text)
- Description (Text)
- Category (Choice)
- Price (Number)
- OriginalPrice (Number)
- Status (Choice: Active, Pending, Sold)
- Images (Text - comma-separated URLs)
- ViewCount (Number)
- IsFeatured (Boolean)
- IsLookingFor (Boolean)
- CreatedBy (Text)
- Location (Text)
- Condition (Choice)
- Tags (Text - comma-separated)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the troubleshooting section above

## 🔮 Future Enhancements

- **AI-Powered Ad Creation**: Integration with Microsoft 365 Copilot
- **Advanced Analytics**: View trends and popular items
- **Mobile App**: Native iOS/Android applications
- **Integration**: Teams, Outlook, and SharePoint integration
- **Notifications**: Real-time updates and alerts
- **Moderation Tools**: Admin interface for content management
