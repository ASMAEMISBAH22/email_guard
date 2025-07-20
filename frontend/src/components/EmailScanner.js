import React, { useState } from 'react';
import { Scan, Shield, AlertTriangle, CheckCircle, XCircle, Clock, Brain } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';

const EmailScanner = ({ apiKey, onNewScan }) => {
  const [emailText, setEmailText] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState('');
  const { isDarkMode } = useTheme();

  const sampleEmails = [
    {
      name: "Phishing Example",
      text: "URGENT: Your PayPal account has been suspended! Click here immediately to verify your account and avoid permanent closure. Limited time offer - act now!"
    },
    {
      name: "Spam Example", 
      text: "Congratulations! You've won $1,000,000! Call now to claim your prize. No obligation, free trial. Make money fast working from home!"
    },
    {
      name: "Legitimate Example",
      text: "Hi John, Thanks for your email about the project update. I've reviewed the documents and everything looks good. Let's schedule a meeting next week to discuss the next steps. Best regards, Sarah"
    }
  ];

  const handleScan = async () => {
    if (!emailText.trim()) {
      setError('Please enter email content to scan');
      return;
    }
    if (!apiKey) {
      setError('API key is required');
      return;
    }
    setIsScanning(true);
    setError('');
    setScanResult(null);
    try {
      const response = await axios.post('/scan', {
        email_text: emailText,
        user_id: 'web-user'
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      const result = response.data;
      setScanResult(result);
      onNewScan(result);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Invalid API key. Please check your API key.');
      } else if (err.response?.status === 429) {
        setError('Rate limit exceeded. Please try again later.');
      } else {
        setError(err.response?.data?.detail || 'Failed to scan email. Please try again.');
      }
    } finally {
      setIsScanning(false);
    }
  };

  const getRiskColor = (riskLevel) => {
    if (isDarkMode) {
      switch (riskLevel) {
        case 'high': return 'text-red-400 bg-red-900/20 border-red-700';
        case 'medium': return 'text-yellow-300 bg-yellow-900/20 border-yellow-700';
        case 'low': return 'text-green-300 bg-green-900/20 border-green-700';
        default: return 'text-gray-400 bg-gray-800 border-gray-700';
      }
    } else {
      switch (riskLevel) {
        case 'high': return 'text-red-600 bg-red-50 border-red-200';
        case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        case 'low': return 'text-green-600 bg-green-50 border-green-200';
        default: return 'text-gray-600 bg-gray-50 border-gray-200';
      }
    }
  };

  const getClassificationIcon = (classification) => {
    if (isDarkMode) {
      switch (classification) {
        case 'phishing': return <XCircle className="w-6 h-6 text-red-400" />;
        case 'spam': return <AlertTriangle className="w-6 h-6 text-yellow-300" />;
        case 'suspicious': return <AlertTriangle className="w-6 h-6 text-orange-400" />;
        case 'legitimate': return <CheckCircle className="w-6 h-6 text-green-400" />;
        default: return <Shield className="w-6 h-6 text-gray-500" />;
      }
    } else {
      switch (classification) {
        case 'phishing': return <XCircle className="w-6 h-6 text-red-500" />;
        case 'spam': return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
        case 'suspicious': return <AlertTriangle className="w-6 h-6 text-orange-500" />;
        case 'legitimate': return <CheckCircle className="w-6 h-6 text-green-500" />;
        default: return <Shield className="w-6 h-6 text-gray-500" />;
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Scanner Card */}
      <div className={`card p-6 ${isDarkMode ? 'dark' : ''}`}>
        <div className="flex items-center space-x-3 mb-6">
          <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${
            isDarkMode ? 'bg-gray-700' : 'bg-primary-100'
          }`}>
            <Scan className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-primary-600'}`} />
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Email Scanner
            </h2>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Paste your email content below for AI-powered analysis
            </p>
          </div>
        </div>

        {/* Sample Emails */}
        <div className="mb-4">
          <label className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-200' : 'text-gray-700'
          }`}>
            Quick Test Samples:
          </label>
          <div className="flex flex-wrap gap-2">
            {sampleEmails.map((sample, index) => (
              <button
                key={index}
                onClick={() => setEmailText(sample.text)}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {sample.name}
              </button>
            ))}
          </div>
        </div>

        {/* Email Input */}
        <div className="mb-6">
          <label htmlFor="email-text" className={`block text-sm font-medium mb-2 ${
            isDarkMode ? 'text-gray-200' : 'text-gray-700'
          }`}>
            Email Content
          </label>
          <textarea
            id="email-text"
            value={emailText}
            onChange={(e) => setEmailText(e.target.value)}
            placeholder="Paste the email content here..."
            className={`input-field h-40 ${isDarkMode ? 'dark' : ''}`}
            disabled={isScanning}
          />
          <div className={`mt-2 text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {emailText.length}/50,000 characters
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className={`mb-4 p-4 rounded-lg ${
            isDarkMode 
              ? 'bg-red-900/40 border border-red-700' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center space-x-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <span className={`font-medium ${
                isDarkMode ? 'text-red-300' : 'text-red-700'
              }`}>{error}</span>
            </div>
          </div>
        )}

        {/* Scan Button */}
        <button
          onClick={handleScan}
          disabled={isScanning || !emailText.trim() || !apiKey}
          className={`btn-primary w-full sm:w-auto ${isDarkMode ? 'dark' : ''}`}
        >
          {isScanning ? (
            <div className="flex items-center space-x-2">
              <div className="spinner"></div>
              <span>Analyzing Email...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span>Scan Email</span>
            </div>
          )}
        </button>
      </div>

      {/* Results Card */}
      {scanResult && (
        <div className={`card p-6 animate-in slide-in-from-bottom duration-500 ${isDarkMode ? 'dark' : ''}`}>
          <div className="flex items-center space-x-3 mb-6">
            <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              {getClassificationIcon(scanResult.classification)}
            </div>
            <div>
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Scan Results
              </h3>
              <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Analysis completed in {scanResult.processing_time_ms}ms
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Classification */}
            <div className="space-y-3">
              <div>
                <label className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>Classification</label>
                <div className={`mt-1 px-3 py-2 rounded-lg border font-medium text-center ${getRiskColor(scanResult.risk_level)}`}>
                  {scanResult.classification.toUpperCase()}
                </div>
              </div>

              <div>
                <label className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>Confidence Score</label>
                <div className={`mt-1 rounded-lg h-6 relative ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <div 
                    className={`h-full rounded-lg transition-all duration-1000 ${
                      scanResult.confidence >= 0.7 ? 'bg-red-500' : 
                      scanResult.confidence >= 0.4 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.max(scanResult.confidence * 100, 5)}%` }}
                  ></div>
                  <span className={`absolute inset-0 flex items-center justify-center text-sm font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {(scanResult.confidence * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Risk Level & Timing */}
            <div className="space-y-3">
              <div>
                <label className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>Risk Level</label>
                <div className={`mt-1 px-3 py-2 rounded-lg border font-medium text-center ${getRiskColor(scanResult.risk_level)}`}>
                  {scanResult.risk_level.toUpperCase()}
                </div>
              </div>

              <div>
                <label className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>Processing Time</label>
                <div className={`mt-1 flex items-center space-x-2 px-3 py-2 rounded-lg ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className={`font-medium ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-900'
                  }`}>{scanResult.processing_time_ms}ms</span>
                </div>
              </div>
            </div>
          </div>

          {/* Explanation */}
          <div className="mb-4">
            <label className={`text-sm font-medium ${
              isDarkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>Analysis Explanation</label>
            <div className={`mt-1 p-3 rounded-lg ${
              isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <p className={isDarkMode ? 'text-gray-200' : 'text-gray-800'}>
                {scanResult.explanation}
              </p>
            </div>
          </div>

          {/* Suspicious Patterns */}
          {scanResult.suspicious_patterns && scanResult.suspicious_patterns.length > 0 && (
            <div>
              <label className={`text-sm font-medium ${
                isDarkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>Suspicious Patterns Detected</label>
              <div className="mt-1 space-y-1">
                {scanResult.suspicious_patterns.map((pattern, index) => (
                  <div key={index} className={`px-3 py-2 rounded text-sm ${
                    isDarkMode 
                      ? 'bg-yellow-900/40 border border-yellow-700 text-yellow-200'
                      : 'bg-yellow-50 border border-yellow-200 text-yellow-800'
                  }`}>
                    {pattern}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Scan ID */}
          <div className={`mt-4 pt-4 border-t ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className={`text-xs ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Scan ID: {scanResult.scan_id} • {new Date(scanResult.timestamp).toLocaleString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailScanner; 