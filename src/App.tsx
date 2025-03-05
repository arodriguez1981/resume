import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ResumeCustomizationProvider } from './contexts/ResumeCustomizationContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Editor from './pages/Editor';
import Pricing from './pages/Pricing';
import Profile from './pages/Profile';
import CoverLetter from './pages/CoverLetter';
import Footer from './components/Footer';
import MaintenancePage from './components/MaintenancePage';
import PaymentStatusCheck from './components/PaymentStatusCheck';
import { useAuth } from './contexts/AuthContext';

const ProRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isPremiumUser, isProUser } = useAuth();
  
  if (!user || (!isPremiumUser && !isProUser)) {
    return <Navigate to="/pricing" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  const isMaintenanceMode = import.meta.env.VITE_MAINTENANCE_MODE === 'true';

  if (isMaintenanceMode) {
    return <MaintenancePage />;
  }

  return (
    <AuthProvider>
      <ResumeCustomizationProvider>
        <LanguageProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <Navbar />
              <main className="flex-grow">
                <PaymentStatusCheck />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/editor" element={<Editor />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route 
                    path="/coverletter" 
                    element={
                      <ProRoute>
                        <CoverLetter />
                      </ProRoute>
                    } 
                  />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </LanguageProvider>
      </ResumeCustomizationProvider>
    </AuthProvider>
  );
}

export default App;