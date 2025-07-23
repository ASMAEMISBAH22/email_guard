import React, { useState } from 'react';
import { Key, Plus, Eye, EyeOff, Copy, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { emailAPI } from '../services/api';

const ApiKeyManager = ({ currentApiKey, onApiKeySet }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [keyName, setKeyName] = useState('');
  const [keyDescription, setKeyDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newApiKey, setNewApiKey] = useState('');
  const [showCurrentKey, setShowCurrentKey] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { isDarkMode } = useTheme();

  const handleCreateKey = async () => {
    if (!keyName.trim()) {
      setError('Key name is required');
      return;
    }

    setIsCreating(true);
    setError('');
    setSuccess('');

    try {
      const response = await emailAPI.createApiKey(keyName.trim(), keyDescription.trim() || undefined);

      setNewApiKey(response.data.api_key);
      setSuccess('API key created successfully!');
      setKeyName('');
      setKeyDescription('');
      setShowCreateForm(false);
    } catch (err) {
      console.error('Create key error:', err);
      setError(err.response?.data?.detail || 'Failed to create API key');
    } finally {
      setIsCreating(false);
    }
  };

  const handleUseKey = (key) => {
    onApiKeySet(key);
    setNewApiKey('');
    setSuccess('API key set successfully!');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setSuccess('Copied to clipboard!');
      setTimeout(() => setSuccess(''), 2000);
    });
  };

  const maskKey = (key) => {
    if (!key) return '';
    return key.substring(0, 8) + '...' + key.substring(key.length - 8);
  };

  return (
    <div className="space-y-6">
      {/* Current API Key Status */}
      <div className={`card p-6 ${isDarkMode ? 'dark' : ''}`}>
        <div className="flex items-center space-x-3 mb-6">
          <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${
            isDarkMode ? 'bg-gray-700' : 'bg-primary-100'
          }`}>
            <Key className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-primary-600'}`} />
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              API Key Management
            </h2>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
              Manage your Email Guardian API access keys
            </p>
          </div>
        </div>

        {currentApiKey ? (
          <div className={`rounded-lg p-4 ${
            isDarkMode 
              ? 'bg-green-900/20 border border-green-700' 
              : 'bg-green-50 border border-green-200'
          }`}>
            <div className="flex items-center space-x-2 mb-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className={`font-medium ${
                isDarkMode ? 'text-green-300' : 'text-green-800'
              }`}>API Key Active</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-between">
                <label className={`text-sm font-medium ${
                  isDarkMode ? 'text-green-300' : 'text-green-700'
                }`}>Current API Key:</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className={`flex-1 px-3 py-2 border rounded text-sm font-mono ${
                  isDarkMode 
                    ? 'bg-gray-800 border-green-600 text-green-300' 
                    : 'bg-white border-green-300'
                }`}>
                  {showCurrentKey ? currentApiKey : maskKey(currentApiKey)}
                </div>
                <button
                  onClick={() => setShowCurrentKey(!showCurrentKey)}
                  className={`p-2 rounded ${
                    isDarkMode 
                      ? 'text-green-400 hover:text-green-300 hover:bg-green-900/20' 
                      : 'text-green-600 hover:text-green-700 hover:bg-green-100'
                  }`}
                >
                  {showCurrentKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => copyToClipboard(currentApiKey)}
                  className={`p-2 rounded ${
                    isDarkMode 
                      ? 'text-green-400 hover:text-green-300 hover:bg-green-900/20' 
                      : 'text-green-600 hover:text-green-700 hover:bg-green-100'
                  }`}
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className={`rounded-lg p-4 ${
            isDarkMode 
              ? 'bg-yellow-900/20 border border-yellow-700' 
              : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              <XCircle className="w-5 h-5 text-yellow-500" />
              <span className={`font-medium ${
                isDarkMode ? 'text-yellow-300' : 'text-yellow-800'
              }`}>No API Key Set</span>
            </div>
            <p className={`text-sm ${
              isDarkMode ? 'text-yellow-300' : 'text-yellow-700'
            }`}>
              You need an API key to use the email scanning service. Create one below or enter an existing key.
            </p>
          </div>
        )}
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className={`rounded-lg p-4 ${
          isDarkMode 
            ? 'bg-green-900/20 border border-green-700' 
            : 'bg-green-50 border border-green-200'
        }`}>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className={isDarkMode ? 'text-green-300' : 'text-green-800'}>{success}</span>
          </div>
        </div>
      )}

      {error && (
        <div className={`rounded-lg p-4 ${
          isDarkMode 
            ? 'bg-red-900/20 border border-red-700' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center space-x-2">
            <XCircle className="w-5 h-5 text-red-500" />
            <span className={isDarkMode ? 'text-red-300' : 'text-red-800'}>{error}</span>
          </div>
        </div>
      )}

      {/* New API Key Display */}
      {newApiKey && (
        <div className={`card p-6 border-2 ${isDarkMode ? 'dark border-green-700 bg-green-900/20' : 'border-green-200 bg-green-50'}`}>
          <h3 className={`text-lg font-bold mb-4 ${
            isDarkMode ? 'text-green-300' : 'text-green-800'
          }`}>🎉 New API Key Created!</h3>
          
          <div className={`border rounded-lg p-4 mb-4 ${
            isDarkMode 
              ? 'bg-gray-800 border-green-600' 
              : 'bg-white border-green-300'
          }`}>
            <label className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-green-300' : 'text-green-700'
            }`}>
              Your New API Key:
            </label>
            <div className="flex items-center space-x-2">
              <div className={`flex-1 px-3 py-2 border rounded text-sm font-mono break-all ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-gray-200' 
                  : 'bg-gray-50 border-gray-300'
              }`}>
                {newApiKey}
              </div>
              <button
                onClick={() => copyToClipboard(newApiKey)}
                className={`p-2 rounded ${
                  isDarkMode 
                    ? 'text-green-400 hover:text-green-300 hover:bg-green-900/20' 
                    : 'text-green-600 hover:text-green-700 hover:bg-green-100'
                }`}
                title="Copy to clipboard"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className={`border rounded-lg p-3 mb-4 ${
            isDarkMode 
              ? 'bg-yellow-900/20 border-yellow-700' 
              : 'bg-yellow-50 border-yellow-200'
          }`}>
            <p className={`text-sm font-medium ${
              isDarkMode ? 'text-yellow-300' : 'text-yellow-800'
            }`}>
              ⚠️ Important: Store this key securely! It won't be shown again.
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => handleUseKey(newApiKey)}
              className={`btn-primary ${isDarkMode ? 'dark' : ''}`}
            >
              Use This Key
            </button>
            <button
              onClick={() => setNewApiKey('')}
              className={`btn-secondary ${isDarkMode ? 'dark' : ''}`}
            >
              I'll Save It Later
            </button>
          </div>
        </div>
      )}

      {/* Create New API Key */}
      <div className={`card p-6 ${isDarkMode ? 'dark' : ''}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Create New API Key
          </h3>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className={`btn-secondary flex items-center space-x-2 ${isDarkMode ? 'dark' : ''}`}
          >
            <Plus className="w-4 h-4" />
            <span>{showCreateForm ? 'Cancel' : 'Create Key'}</span>
          </button>
        </div>

        {showCreateForm && (
          <div className="space-y-4">
            <div>
              <label htmlFor="key-name" className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Key Name *
              </label>
              <input
                id="key-name"
                type="text"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                placeholder="e.g., My Email Scanner Key"
                className={`input-field ${isDarkMode ? 'dark' : ''}`}
                disabled={isCreating}
              />
            </div>

            <div>
              <label htmlFor="key-description" className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Description (Optional)
              </label>
              <textarea
                id="key-description"
                value={keyDescription}
                onChange={(e) => setKeyDescription(e.target.value)}
                placeholder="Brief description of what this key will be used for..."
                rows={3}
                className={`input-field ${isDarkMode ? 'dark' : ''}`}
                disabled={isCreating}
              />
            </div>

            <button
              onClick={handleCreateKey}
              disabled={isCreating || !keyName.trim()}
              className={`btn-primary w-full ${isDarkMode ? 'dark' : ''}`}
            >
              {isCreating ? (
                <div className="flex items-center space-x-2 justify-center">
                  <div className="spinner"></div>
                  <span>Creating API Key...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 justify-center">
                  <Plus className="w-4 h-4" />
                  <span>Create API Key</span>
                </div>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Manual API Key Entry */}
      <div className={`card p-6 ${isDarkMode ? 'dark' : ''}`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          Enter Existing API Key
        </h3>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="existing-key" className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              API Key
            </label>
            <input
              id="existing-key"
              type="password"
              placeholder="Enter your existing API key..."
              className={`input-field ${isDarkMode ? 'dark' : ''}`}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  handleUseKey(e.target.value.trim());
                }
              }}
            />
          </div>

          <button
            onClick={() => {
              const keyInput = document.getElementById('existing-key');
              if (keyInput && keyInput.value.trim()) {
                handleUseKey(keyInput.value.trim());
                keyInput.value = '';
              }
            }}
            className={`btn-secondary w-full ${isDarkMode ? 'dark' : ''}`}
          >
            Set API Key
          </button>
        </div>
      </div>

      {/* API Documentation */}
      <div className={`card p-6 bg-gray-50 ${isDarkMode ? 'dark' : ''}`}>
        <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          API Usage Information
        </h3>
        
        <div className="space-y-3 text-sm text-gray-600">
          <div className="flex items-start space-x-2">
            <span className="font-medium text-gray-700">Endpoint:</span>
            <code className="bg-gray-200 px-2 py-1 rounded text-xs">POST /scan</code>
          </div>
          
          <div className="flex items-start space-x-2">
            <span className="font-medium text-gray-700">Header:</span>
            <code className="bg-gray-200 px-2 py-1 rounded text-xs">Authorization: Bearer YOUR_API_KEY</code>
          </div>
          
          <div className="flex items-start space-x-2">
            <span className="font-medium text-gray-700">Rate Limit:</span>
            <span>100 requests per hour</span>
          </div>
          
          <div className="flex items-start space-x-2">
            <span className="font-medium text-gray-700">Max Email Size:</span>
            <span>50KB per request</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyManager; 