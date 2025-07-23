import React, { useState, useEffect } from 'react';
import { History, Clock, Shield, AlertTriangle, CheckCircle, XCircle, RefreshCw, Trash2 } from 'lucide-react';
import { emailAPI } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';

const ScanHistory = ({ apiKey, localHistory }) => {
  const [serverHistory, setServerHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (apiKey) {
      fetchServerHistory();
    }
  }, [apiKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchServerHistory = async () => {
    if (!apiKey) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await emailAPI.getHistory({ limit: 50 });
      setServerHistory(response.data.history || []);
    } catch (err) {
      console.error('History fetch error:', err);
      if (err.response?.status === 401) {
        setError('Invalid API key');
      } else {
        setError('Failed to load server history');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Combine and deduplicate local and server history
  const allHistory = React.useMemo(() => {
    const combined = [...localHistory];
    
    // Add server history items that aren't already in local history
    serverHistory.forEach(serverItem => {
      const exists = combined.some(localItem => localItem.scan_id === serverItem.scan_id);
      if (!exists) {
        combined.push(serverItem);
      }
    });

    // Filter by classification
    let filtered = combined;
    if (filter !== 'all') {
      filtered = combined.filter(item => item.classification === filter);
    }

    // Sort by selected criteria
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.timestamp) - new Date(a.timestamp);
        case 'oldest':
          return new Date(a.timestamp) - new Date(b.timestamp);
        case 'confidence':
          return b.confidence - a.confidence;
        case 'risk':
          const riskOrder = { high: 3, medium: 2, low: 1 };
          return riskOrder[b.risk_level] - riskOrder[a.risk_level];
        default:
          return 0;
      }
    });

    return filtered;
  }, [localHistory, serverHistory, filter, sortBy]);

  const getClassificationIcon = (classification) => {
    if (isDarkMode) {
      switch (classification) {
        case 'phishing': return <XCircle className="w-5 h-5 text-red-400" />;
        case 'spam': return <AlertTriangle className="w-5 h-5 text-yellow-300" />;
        case 'suspicious': return <AlertTriangle className="w-5 h-5 text-orange-400" />;
        case 'legitimate': return <CheckCircle className="w-5 h-5 text-green-400" />;
        default: return <AlertTriangle className="w-5 h-5 text-gray-500" />;
      }
    } else {
      switch (classification) {
        case 'phishing': return <XCircle className="w-5 h-5 text-red-500" />;
        case 'spam': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
        case 'suspicious': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
        case 'legitimate': return <CheckCircle className="w-5 h-5 text-green-500" />;
        default: return <AlertTriangle className="w-5 h-5 text-gray-500" />;
      }
    }
  };

  const getRiskBadgeClass = (riskLevel) => {
    if (isDarkMode) {
      switch (riskLevel) {
        case 'high': return 'bg-red-900/20 text-red-300 border-red-700';
        case 'medium': return 'bg-yellow-900/20 text-yellow-300 border-yellow-700';
        case 'low': return 'bg-green-900/20 text-green-300 border-green-700';
        default: return 'bg-gray-800 text-gray-300 border-gray-700';
      }
    } else {
      switch (riskLevel) {
        case 'high': return 'bg-red-100 text-red-800 border-red-200';
        case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'low': return 'bg-green-100 text-green-800 border-green-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.7) return 'bg-red-500';
    if (confidence >= 0.4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const stats = React.useMemo(() => {
    const total = allHistory.length;
    const phishing = allHistory.filter(item => item.classification === 'phishing').length;
    const spam = allHistory.filter(item => item.classification === 'spam').length;
    const legitimate = allHistory.filter(item => item.classification === 'legitimate').length;
    const avgConfidence = total > 0 ? 
      allHistory.reduce((sum, item) => sum + item.confidence, 0) / total : 0;

    return { total, phishing, spam, legitimate, avgConfidence };
  }, [allHistory]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`card p-6 ${isDarkMode ? 'dark' : ''}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${
              isDarkMode ? 'bg-gray-700' : 'bg-primary-100'
            }`}>
              <History className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-primary-600'}`} />
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Scan History
              </h2>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                View your previous email scan results
              </p>
            </div>
          </div>

          {apiKey && (
            <button
              onClick={fetchServerHistory}
              disabled={isLoading}
              className={`btn-secondary flex items-center space-x-2 ${isDarkMode ? 'dark' : ''}`}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className={`rounded-lg p-4 text-center ${
            isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
          }`}>
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {stats.total}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Total Scans
            </div>
          </div>
          <div className={`rounded-lg p-4 text-center ${
            isDarkMode ? 'bg-red-900/20' : 'bg-red-50'
          }`}>
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
              {stats.phishing}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-red-300' : 'text-red-600'}`}>
              Phishing
            </div>
          </div>
          <div className={`rounded-lg p-4 text-center ${
            isDarkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'
          }`}>
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-yellow-300' : 'text-yellow-600'}`}>
              {stats.spam}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-yellow-300' : 'text-yellow-600'}`}>
              Spam
            </div>
          </div>
          <div className={`rounded-lg p-4 text-center ${
            isDarkMode ? 'bg-green-900/20' : 'bg-green-50'
          }`}>
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
              {stats.legitimate}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-green-300' : 'text-green-600'}`}>
              Legitimate
            </div>
          </div>
          <div className={`rounded-lg p-4 text-center ${
            isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'
          }`}>
            <div className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              {(stats.avgConfidence * 100).toFixed(1)}%
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
              Avg Confidence
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Shield className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Filter:
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={`text-sm border rounded px-3 py-1 focus:ring-2 focus:border-transparent ${
                isDarkMode 
                  ? 'border-gray-600 bg-gray-800 text-white focus:ring-blue-500' 
                  : 'border-gray-300 focus:ring-primary-500'
              }`}
            >
              <option value="all">All Types</option>
              <option value="phishing">Phishing</option>
              <option value="spam">Spam</option>
              <option value="suspicious">Suspicious</option>
              <option value="legitimate">Legitimate</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Sort:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`text-sm border rounded px-3 py-1 focus:ring-2 focus:border-transparent ${
                isDarkMode 
                  ? 'border-gray-600 bg-gray-800 text-white focus:ring-blue-500' 
                  : 'border-gray-300 focus:ring-primary-500'
              }`}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="confidence">By Confidence</option>
              <option value="risk">By Risk Level</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
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

      {/* History List */}
      <div className="space-y-4">
        {allHistory.length === 0 ? (
          <div className={`card p-12 text-center ${isDarkMode ? 'dark' : ''}`}>
            <History className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} />
            <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              No Scan History
            </h3>
            <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
              Start scanning emails to see your history here.
            </p>
          </div>
        ) : (
          allHistory.map((scan) => (
            <div key={scan.scan_id} className={`card p-6 ${isDarkMode ? 'dark' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    {getClassificationIcon(scan.classification)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {scan.classification.charAt(0).toUpperCase() + scan.classification.slice(1)}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium border rounded ${getRiskBadgeClass(scan.risk_level)}`}>
                        {scan.risk_level.toUpperCase()}
                      </span>
                    </div>
                    
                    <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {scan.explanation}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-xs">
                      <div className={`flex items-center space-x-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <Clock className="w-3 h-3" />
                        <span>{new Date(scan.timestamp).toLocaleString()}</span>
                      </div>
                      <div className={`flex items-center space-x-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <span>Confidence: {(scan.confidence * 100).toFixed(1)}%</span>
                      </div>
                      <div className={`flex items-center space-x-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <span>ID: {scan.scan_id}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  <div className={`w-20 h-2 rounded-full ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${getConfidenceColor(scan.confidence)}`}
                      style={{ width: `${Math.max(scan.confidence * 100, 5)}%` }}
                    ></div>
                  </div>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {scan.processing_time_ms}ms
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ScanHistory; 