import React, { useState } from 'react';
import { Scan, Shield, AlertTriangle, CheckCircle, XCircle, Clock, Brain, Mail } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { emailAPI } from '../services/api';

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
      const response = await emailAPI.scanEmail({
        email_text: emailText,
        user_id: 'web-user'
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
        case 'low': return 'text-green-400 bg-green-900/20 border-green-700';
        default: return 'text-gray-400 bg-gray-800 border-gray-700';
      }
    } else {
      switch (riskLevel) {
        case 'high': return 'text-red-700 bg-red-50 border-red-200';
        case 'medium': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
        case 'low': return 'text-green-700 bg-green-50 border-green-200';
        default: return 'text-gray-700 bg-gray-50 border-gray-200';
      }
    }
  };

  const getClassificationIcon = (classification) => {
    switch (classification) {
      case 'phishing': return <XCircle className="w-6 h-6 text-red-500" />;
      case 'spam': return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      case 'suspicious': return <AlertTriangle className="w-6 h-6 text-orange-500" />;
      case 'legitimate': return <CheckCircle className="w-6 h-6 text-green-500" />;
      default: return <Shield className="w-6 h-6 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Email Security Scanner</h2>
        <p className={`text-lg ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
          Analyze emails with AI-powered threat detection
        </p>
      </div>

      {/* Main Scanner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="lg:col-span-2">
          <div className={`rounded-xl border p-6 transition-colors duration-200 ${
            isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
          }`}>
            <h3 className="text-xl font-semibold mb-4">Email Analysis</h3>

            {/* Sample Emails */}
            <div className="mb-6">
              <label className={`block text-sm font-medium mb-3 ${
                isDarkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Quick Test Samples:
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {sampleEmails.map((sample, index) => (
                  <button
                    key={index}
                    onClick={() => setEmailText(sample.text)}
                    className={`p-3 text-left rounded-lg border transition-colors duration-200 ${
                      isDarkMode 
                        ? 'bg-slate-700 border-slate-600 hover:border-slate-500' 
                        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-sm mb-1">{sample.name}</div>
                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                      {sample.text.substring(0, 60)}...
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Email Input */}
            <div className="mb-6">
              <label htmlFor="email-text" className={`block text-sm font-medium mb-2 ${
                isDarkMode ? 'text-slate-300' : 'text-gray-700'
              }`}>
                Email Content
              </label>
              <textarea
                id="email-text"
                value={emailText}
                onChange={(e) => setEmailText(e.target.value)}
                placeholder="Paste your email content here..."
                className={`w-full px-4 py-3 border rounded-lg h-48 resize-none transition-colors duration-200 ${
                  isDarkMode 
                    ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                disabled={isScanning}
              />
              <div className={`mt-2 text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                {emailText.length}/50,000 characters
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className={`mb-6 p-4 rounded-lg border-l-4 border-red-500 ${
                isDarkMode 
                  ? 'bg-red-900/20 border border-red-800' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
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
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isScanning ? (
                <>
                  <div className="spinner"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Scan className="w-5 h-5" />
                  <span>Analyze Email</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div>
          {scanResult ? (
            <div className={`rounded-xl border p-6 transition-colors duration-200 ${
              isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
            }`}>
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-full ${
                    scanResult.risk_level === 'high' 
                      ? 'bg-red-100 text-red-600' 
                      : scanResult.risk_level === 'medium'
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-green-100 text-green-600'
                  }`}>
                    {getClassificationIcon(scanResult.classification)}
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Scan Results</h3>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(scanResult.risk_level)}`}>
                  {scanResult.classification.toUpperCase()}
                </div>
              </div>

              {/* Confidence Score */}
              <div className="mb-6">
                <div className={`flex justify-between text-sm mb-2 ${
                  isDarkMode ? 'text-slate-300' : 'text-gray-600'
                }`}>
                  <span>Confidence</span>
                  <span>{(scanResult.confidence * 100).toFixed(1)}%</span>
                </div>
                <div className={`w-full h-3 rounded-full ${
                  isDarkMode ? 'bg-slate-700' : 'bg-gray-200'
                }`}>
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      scanResult.confidence >= 0.7 ? 'bg-red-500' : 
                      scanResult.confidence >= 0.4 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.max(scanResult.confidence * 100, 5)}%` }}
                  ></div>
                </div>
              </div>

              {/* Analysis */}
              <div className="mb-4">
                <label className={`text-sm font-medium ${
                  isDarkMode ? 'text-slate-300' : 'text-gray-600'
                }`}>Analysis</label>
                <p className={`mt-1 text-sm ${
                  isDarkMode ? 'text-slate-200' : 'text-gray-800'
                }`}>
                  {scanResult.explanation}
                </p>
              </div>

              {/* Suspicious Patterns */}
              {scanResult.suspicious_patterns && scanResult.suspicious_patterns.length > 0 && (
                <div className="mb-4">
                  <label className={`text-sm font-medium ${
                    isDarkMode ? 'text-slate-300' : 'text-gray-600'
                  }`}>Suspicious Patterns</label>
                  <div className="mt-2 space-y-1">
                    {scanResult.suspicious_patterns.slice(0, 2).map((pattern, index) => (
                      <div key={index} className={`px-3 py-2 rounded-lg text-sm ${
                        isDarkMode 
                          ? 'bg-yellow-900/20 text-yellow-300' 
                          : 'bg-yellow-50 text-yellow-800'
                      }`}>
                        {pattern}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className={`pt-4 border-t text-xs ${
                isDarkMode ? 'border-slate-700 text-slate-400' : 'border-gray-200 text-gray-500'
              }`}>
                <div className="flex items-center justify-between">
                  <span>ID: {scanResult.scan_id}</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{scanResult.processing_time_ms}ms</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={`rounded-xl border p-6 text-center transition-colors duration-200 ${
              isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
            }`}>
              <Mail className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-slate-600' : 'text-gray-400'}`} />
              <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                Ready to Scan
              </h3>
              <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                Enter email content to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailScanner; 