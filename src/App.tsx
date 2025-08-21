import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from './auth/msalConfig';
import { ClassifiedsListing } from './components/ClassifiedsListing';
import { CreateAdForm } from './components/CreateAdForm';
import type { ClassifiedAd } from './types/classifieds';

function App() {
  const { instance, accounts } = useMsal();

  useEffect(() => {
    if (accounts.length === 0) {
      instance.loginPopup(loginRequest).catch(() => {
        // ignore; user can retry
      });
    }
  }, [accounts, instance]);

  const handleContact = (ad: ClassifiedAd) => {
    // In a real app, this would open a Teams chat or email
    alert(`Contact ${ad.createdBy} about "${ad.title}"\n\nThis would integrate with Microsoft Teams or email.`);
  };

  const handleShare = (ad: ClassifiedAd) => {
    const shareUrl = `${window.location.origin}/ad/${ad.id}`;
    if (navigator.share) {
      navigator.share({
        title: ad.title,
        text: ad.description,
        url: shareUrl
      });
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Link copied to clipboard!');
      });
    }
  };

  if (accounts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Signing you in...</p>
          <button
            onClick={() => instance.loginPopup(loginRequest)}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-gray-900">Company Classifieds</h1>
                <span className="text-sm text-gray-500">Welcome, {accounts[0]?.name}</span>
              </div>
              <button
                onClick={() => instance.logout()}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>
          <Routes>
            <Route 
              path="/" 
              element={
                <ClassifiedsListing 
                  onContact={handleContact}
                  onShare={handleShare}
                />
              } 
            />
            <Route 
              path="/create" 
              element={
                <div className="max-w-4xl mx-auto p-6">
                  <CreateAdForm />
                </div>
              } 
            />
            <Route 
              path="/ad/:id" 
              element={
                <div className="max-w-4xl mx-auto p-6">
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold mb-4">Ad Details</h2>
                    <p className="text-gray-600">Ad detail view would be implemented here.</p>
                    <p className="text-gray-600">This would show the full ad information, images, and contact options.</p>
                  </div>
                </div>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
