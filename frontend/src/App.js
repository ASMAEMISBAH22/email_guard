import React, { useState, useEffect } from 'react';
import { Shield, Mail, AlertTriangle, CheckCircle, History, Key, Zap, Brain } from 'lucide-react';
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
    // Load API key from localStorage
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
    setScanHistory(prev => [scanResult, ...prev.slice(0, 49)]); // Keep last 50 scans
  };

  const tabs = [
    { id: 'scanner', label: 'Email Scanner', icon: Mail },
    { id: 'history', label: 'Scan History', icon: History },
    { id: 'stats', label: 'Statistics', icon: Zap },
    { id: 'api-key', label: 'API Keys', icon: Key }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className={isDarkMode ? 'header-dark' : 'header-light'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                isDarkMode ? 'bg-gray-700' : 'bg-white/20'
              }`}>
                <Shield className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-white'}`} />
              </div>
              <div>
                <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-white'}`}>
                  Smart Email Guardian
                </h1>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-white/80'}`}>
                  AI-Powered Spam & Phishing Detection
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 rounded-lg px-3 py-2 ${
                isDarkMode ? 'bg-gray-700' : 'bg-white/10'
              }`}>
                <Brain className={`w-4 h-4 ${isDarkMode ? 'text-blue-400' : 'text-white'}`} />
                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-white'}`}>
                  AI Protected
                </span>
              </div>
              
              {apiKey && (
                <div className="flex items-center space-x-2 bg-green-500/20 rounded-lg px-3 py-2">
                  <CheckCircle className="w-4 h-4 text-green-300" />
                  <span className="text-sm text-green-300 font-medium">API Connected</span>
                </div>
              )}

              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className={isDarkMode ? 'nav-dark' : 'nav-light'}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-4 border-b-2 font-medium text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'border-white text-white'
                      : isDarkMode 
                        ? 'border-transparent text-gray-300 hover:text-white hover:border-gray-500'
                        : 'border-transparent text-white/70 hover:text-white hover:border-white/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!apiKey && activeTab !== 'api-key' && (
          <div className={`mb-8 card p-6 border-l-4 border-yellow-500 ${isDarkMode ? 'dark' : ''}`}>
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
              <div>
                <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  API Key Required
                </h3>
                <p className={`mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Please set up your API key in the{' '}
                  <button
                    onClick={() => setActiveTab('api-key')}
                    className={`font-medium underline ${
                      isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-primary-600 hover:text-primary-700'
                    }`}
                  >
                    API Keys tab
                  </button>{' '}
                  to start scanning emails.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
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
      </main>

      {/* Footer */}
      <footer className={`mt-16 ${isDarkMode ? 'footer-dark' : 'footer-light'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-white/70'}`}>
              © 2024 Smart Email Guardian. Built for cybersecurity education.
            </div>
            <div className={`flex items-center space-x-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-white/70'}`}>
              <span>CPU-Only AI</span>
              <span>•</span>
              <span>Privacy-First</span>
              <span>•</span>
              <span>Open Source</span>
            </div>
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