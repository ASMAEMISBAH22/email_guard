import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { TrendingUp, Shield, AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Stats = ({ scanHistory }) => {
  const { isDarkMode } = useTheme();

  // Process data for charts
  const processedData = React.useMemo(() => {
    if (!scanHistory || scanHistory.length === 0) {
      return {
        classifications: [],
        riskLevels: [],
        dailyScans: [],
        confidenceDistribution: []
      };
    }

    // Classification distribution
    const classificationCounts = scanHistory.reduce((acc, scan) => {
      acc[scan.classification] = (acc[scan.classification] || 0) + 1;
      return acc;
    }, {});

    const classifications = Object.entries(classificationCounts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      percentage: ((value / scanHistory.length) * 100).toFixed(1)
    }));

    // Risk level distribution
    const riskCounts = scanHistory.reduce((acc, scan) => {
      acc[scan.risk_level] = (acc[scan.risk_level] || 0) + 1;
      return acc;
    }, {});

    const riskLevels = Object.entries(riskCounts).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
      percentage: ((value / scanHistory.length) * 100).toFixed(1)
    }));

    // Daily scans (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toDateString();
    });

    const dailyScans = last7Days.map(dateStr => {
      const scansOnDate = scanHistory.filter(scan => 
        new Date(scan.timestamp).toDateString() === dateStr
      ).length;
      
      return {
        date: new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        scans: scansOnDate
      };
    });

    // Confidence distribution
    const confidenceRanges = [
      { range: '0-20%', min: 0, max: 0.2 },
      { range: '20-40%', min: 0.2, max: 0.4 },
      { range: '40-60%', min: 0.4, max: 0.6 },
      { range: '60-80%', min: 0.6, max: 0.8 },
      { range: '80-100%', min: 0.8, max: 1.0 }
    ];

    const confidenceDistribution = confidenceRanges.map(range => {
      const count = scanHistory.filter(scan => 
        scan.confidence >= range.min && scan.confidence < range.max
      ).length;
      
      return {
        range: range.range,
        count,
        percentage: scanHistory.length > 0 ? ((count / scanHistory.length) * 100).toFixed(1) : 0
      };
    });

    return { classifications, riskLevels, dailyScans, confidenceDistribution };
  }, [scanHistory]);

  // Color schemes for charts
  const classificationColors = {
    'Phishing': '#ef4444',
    'Spam': '#f59e0b',
    'Suspicious': '#f97316',
    'Legitimate': '#22c55e'
  };

  const riskColors = {
    'High': '#dc2626',
    'Medium': '#d97706',
    'Low': '#16a34a'
  };

  // Calculate key metrics
  const totalScans = scanHistory.length;
  const threatDetection = scanHistory.filter(scan => 
    ['phishing', 'spam', 'suspicious'].includes(scan.classification)
  ).length;
  const threatRate = totalScans > 0 ? ((threatDetection / totalScans) * 100).toFixed(1) : 0;
  const avgConfidence = totalScans > 0 ? 
    (scanHistory.reduce((sum, scan) => sum + scan.confidence, 0) / totalScans * 100).toFixed(1) : 0;
  const avgProcessingTime = totalScans > 0 ?
    Math.round(scanHistory.reduce((sum, scan) => sum + scan.processing_time_ms, 0) / totalScans) : 0;

  if (totalScans === 0) {
    return (
      <div className="space-y-6">
        <div className={`card p-12 text-center ${isDarkMode ? 'dark' : ''}`}>
          <Activity className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} />
          <h3 className={`text-lg font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            No Statistics Available
          </h3>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            Start scanning emails to see analytics and statistics here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`card p-6 ${isDarkMode ? 'dark' : ''}`}>
        <div className="flex items-center space-x-3 mb-6">
          <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${
            isDarkMode ? 'bg-gray-700' : 'bg-primary-100'
          }`}>
            <TrendingUp className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-primary-600'}`} />
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Analytics & Statistics
            </h2>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
              Insights from your email security scans
            </p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className={`rounded-xl p-6 text-center ${
            isDarkMode ? 'bg-blue-900/20' : 'bg-blue-50'
          }`}>
            <div className={`flex items-center justify-center w-12 h-12 rounded-lg mx-auto mb-3 ${
              isDarkMode ? 'bg-blue-900/40' : 'bg-blue-100'
            }`}>
              <Activity className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <div className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              {totalScans}
            </div>
            <div className={`text-sm font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
              Total Scans
            </div>
          </div>

          <div className={`rounded-xl p-6 text-center ${
            isDarkMode ? 'bg-red-900/20' : 'bg-red-50'
          }`}>
            <div className={`flex items-center justify-center w-12 h-12 rounded-lg mx-auto mb-3 ${
              isDarkMode ? 'bg-red-900/40' : 'bg-red-100'
            }`}>
              <Shield className={`w-6 h-6 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
            </div>
            <div className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
              {threatRate}%
            </div>
            <div className={`text-sm font-medium ${isDarkMode ? 'text-red-300' : 'text-red-600'}`}>
              Threat Detection
            </div>
          </div>

          <div className={`rounded-xl p-6 text-center ${
            isDarkMode ? 'bg-green-900/20' : 'bg-green-50'
          }`}>
            <div className={`flex items-center justify-center w-12 h-12 rounded-lg mx-auto mb-3 ${
              isDarkMode ? 'bg-green-900/40' : 'bg-green-100'
            }`}>
              <CheckCircle className={`w-6 h-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
            </div>
            <div className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
              {avgConfidence}%
            </div>
            <div className={`text-sm font-medium ${isDarkMode ? 'text-green-300' : 'text-green-600'}`}>
              Avg Confidence
            </div>
          </div>

          <div className={`rounded-xl p-6 text-center ${
            isDarkMode ? 'bg-purple-900/20' : 'bg-purple-50'
          }`}>
            <div className={`flex items-center justify-center w-12 h-12 rounded-lg mx-auto mb-3 ${
              isDarkMode ? 'bg-purple-900/40' : 'bg-purple-100'
            }`}>
              <AlertTriangle className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            <div className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
              {avgProcessingTime}ms
            </div>
            <div className={`text-sm font-medium ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`}>
              Avg Processing
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Classification Distribution */}
        <div className={`card p-6 ${isDarkMode ? 'dark' : ''}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Email Classification Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={processedData.classifications}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {processedData.classifications.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={classificationColors[entry.name] || '#6b7280'} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [value, name]}
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                    border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                    borderRadius: '8px',
                    color: isDarkMode ? '#f9fafb' : '#111827'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {processedData.classifications.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: classificationColors[item.name] || '#6b7280' }}
                ></div>
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {item.name}: {item.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Activity */}
        <div className={`card p-6 ${isDarkMode ? 'dark' : ''}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Daily Scan Activity (Last 7 Days)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={processedData.dailyScans}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={isDarkMode ? '#374151' : '#e5e7eb'} 
                />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280' }}
                  axisLine={{ stroke: isDarkMode ? '#374151' : '#e5e7eb' }}
                />
                <YAxis 
                  tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280' }}
                  axisLine={{ stroke: isDarkMode ? '#374151' : '#e5e7eb' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                    border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                    borderRadius: '8px',
                    color: isDarkMode ? '#f9fafb' : '#111827'
                  }}
                />
                <Bar dataKey="scans" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Level Distribution */}
        <div className={`card p-6 ${isDarkMode ? 'dark' : ''}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Risk Level Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={processedData.riskLevels}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {processedData.riskLevels.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={riskColors[entry.name] || '#6b7280'} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [value, name]}
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                    border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                    borderRadius: '8px',
                    color: isDarkMode ? '#f9fafb' : '#111827'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-2">
            {processedData.riskLevels.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: riskColors[item.name] || '#6b7280' }}
                  ></div>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {item.name}
                  </span>
                </div>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  {item.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Confidence Distribution */}
        <div className={`card p-6 ${isDarkMode ? 'dark' : ''}`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Confidence Score Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={processedData.confidenceDistribution}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={isDarkMode ? '#374151' : '#e5e7eb'} 
                />
                <XAxis 
                  dataKey="range" 
                  tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280' }}
                  axisLine={{ stroke: isDarkMode ? '#374151' : '#e5e7eb' }}
                />
                <YAxis 
                  tick={{ fill: isDarkMode ? '#9ca3af' : '#6b7280' }}
                  axisLine={{ stroke: isDarkMode ? '#374151' : '#e5e7eb' }}
                />
                <Tooltip 
                  formatter={(value, name) => [value, name]}
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
                    border: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
                    borderRadius: '8px',
                    color: isDarkMode ? '#f9fafb' : '#111827'
                  }}
                />
                <Bar dataKey="count" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {((scanHistory.filter(s => s.classification === 'legitimate').length / totalScans) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Safe Emails</div>
            <div className="text-xs text-gray-500 mt-1">
              {scanHistory.filter(s => s.classification === 'legitimate').length} out of {totalScans} emails
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-2">
              {((scanHistory.filter(s => s.classification === 'spam').length / totalScans) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Spam Detected</div>
            <div className="text-xs text-gray-500 mt-1">
              {scanHistory.filter(s => s.classification === 'spam').length} spam emails blocked
            </div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-red-600 mb-2">
              {((scanHistory.filter(s => s.classification === 'phishing').length / totalScans) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Phishing Blocked</div>
            <div className="text-xs text-gray-500 mt-1">
              {scanHistory.filter(s => s.classification === 'phishing').length} phishing attempts stopped
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Analysis powered by AI • CPU-only inference • Privacy-first</span>
            <span>Last updated: {new Date().toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats; 