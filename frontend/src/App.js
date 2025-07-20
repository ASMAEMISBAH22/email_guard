import React, { useState, useEffect } from 'react';
import { Shield, Mail, AlertTriangle, CheckCircle, History, Key, Zap, Brain, ArrowRight } from 'lucide-react';
import EmailScanner from './components/EmailScanner';
import ScanHistory from './components/ScanHistory';
import ApiKeyManager from './components/ApiKeyManager';
import Stats from './components/Stats';
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import './index.css';

function AppContent() {
  const [activeTab, setActiveTab] = useState('scanner');
  const [apiKey, setApiKey] = useState('');
  const [scanHistory, setScanHistory] = useState([]);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const savedApiKey = localStorage.getItem('email-guardian-api-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const handleApiKeySet = (key) => {
    setApiKey(key);
    localStorage.setItem('email-guardian-api-key', key);
  };

  const handleNewScan = (scanResult) => {
    setScanHistory(prev => [scanResult, ...prev.slice(0, 49)]);
  };

  const tabs = [
    { id: 'scanner', label: 'Scanner', icon: Mail },
    { id: 'history', label: 'History', icon: History },
    { id: 'stats', label: 'Analytics', icon: Zap },
    { id: 'api-key', label: 'API Keys', icon: Key }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-gray-900'
    }`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 border-b transition-colors duration-200 ${
        isDarkMode 
          ? 'bg-slate-800 border-slate-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold">Smart Email Guardian</h1>
            </div>
            
            {/* Header Actions */}
            <div className="flex items-center space-x-4">
              {/* Status Indicators */}
              <div className="hidden md:flex items-center space-x-3">
                <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm ${
                  isDarkMode 
                    ? 'bg-blue-900/20 text-blue-300' 
                    : 'bg-blue-50 text-blue-600'
                }`}>
                  <Brain className="w-4 h-4" />
                  <span>AI Active</span>
                </div>
                
                {apiKey && (
                  <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm ${
                    isDarkMode 
                      ? 'bg-green-900/20 text-green-300' 
                      : 'bg-green-50 text-green-600'
                  }`}>
                    <CheckCircle className="w-4 h-4" />
                    <span>Connected</span>
                  </div>
                )}
              </div>

              <ThemeToggle />
              
              {!apiKey && (
                <button
                  onClick={() => setActiveTab('api-key')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Only show when no API key */}
      {!apiKey && activeTab === 'scanner' && (
        <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-white/10 rounded-2xl">
                <Shield className="w-16 h-16 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              AI-Powered Email Security
            </h1>
            
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Detect phishing, spam, and malicious content with 99.8% accuracy using advanced machine learning.
            </p>
            
            <button
              onClick={() => setActiveTab('api-key')}
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-200 flex items-center space-x-2 mx-auto"
            >
              <span>Start Free Analysis</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>
      )}

      {/* Navigation Tabs */}
      <nav className={`border-b transition-colors duration-200 ${
        isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-4 border-b-2 font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? isDarkMode
                        ? 'border-blue-400 text-blue-400'
                        : 'border-blue-600 text-blue-600'
                      : isDarkMode
                        ? 'border-transparent text-slate-400 hover:text-slate-200'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* API Key Required Alert */}
        {!apiKey && activeTab !== 'api-key' && (
          <div className={`mb-8 rounded-xl border-l-4 border-amber-400 p-6 transition-colors duration-200 ${
            isDarkMode 
              ? 'bg-amber-900/10 border border-amber-700/20' 
              : 'bg-amber-50 border border-amber-200'
          }`}>
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
              <div>
                <h3 className={`font-semibold ${isDarkMode ? 'text-amber-200' : 'text-amber-800'}`}>
                  API Key Required
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                  Configure your API key to start analyzing emails.{' '}
                  <button
                    onClick={() => setActiveTab('api-key')}
                    className="font-medium underline hover:no-underline"
                  >
                    Set up API key →
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="transition-opacity duration-300">
          {activeTab === 'scanner' && (
            <EmailScanner 
              apiKey={apiKey} 
              onNewScan={handleNewScan}
            />
          )}
          
          {activeTab === 'history' && (
            <ScanHistory 
              apiKey={apiKey} 
              localHistory={scanHistory}
            />
          )}
          
          {activeTab === 'stats' && (
            <Stats 
              scanHistory={scanHistory}
            />
          )}
          
          {activeTab === 'api-key' && (
            <ApiKeyManager 
              currentApiKey={apiKey}
              onApiKeySet={handleApiKeySet}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className={`mt-20 border-t transition-colors duration-200 ${
        isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-gray-50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold">Smart Email Guardian</span>
            </div>
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
              © 2024 Smart Email Guardian. Built for cybersecurity education.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App; 