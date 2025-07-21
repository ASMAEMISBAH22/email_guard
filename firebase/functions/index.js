const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });
const { v4: uuidv4 } = require('uuid');

// Initialize Firebase Admin
admin.initializeApp();

const db = admin.firestore();

// Pattern-based detection (fallback when AI is not available)
const phishingPatterns = [
  // Urgency patterns
  /urgent|immediate|action required|account suspended|verify now/i,
  /limited time|expires soon|last chance|final notice/i,
  
  // Financial threats
  /account locked|payment overdue|billing issue|refund pending/i,
  /credit card|bank account|social security|password expired/i,
  
  // Suspicious URLs
  /https?:\/\/[^\s]*\.(tk|ml|ga|cf|gq|xyz|top|club|online|site)\b/i,
  /https?:\/\/[^\s]*\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/i,
  
  // Suspicious domains
  /(amaz0n|paypa1|goog1e|faceb00k|app1e|micr0soft)/i,
  
  // Personal information requests
  /(password|username|ssn|credit card|bank account|mother maiden)/i,
  
  // Suspicious attachments
  /\.(exe|bat|scr|pif|com|vbs|js|jar)\b/i,
  
  // Generic greetings
  /(dear user|dear customer|dear sir|dear madam)/i,
];

const spamPatterns = [
  // Marketing keywords
  /(free|discount|offer|limited|sale|deal|save money)/i,
  /(click here|buy now|order now|subscribe|unsubscribe)/i,
  
  // Suspicious subject patterns
  /(viagra|cialis|weight loss|diet pills|make money fast)/i,
  /(winner|prize|lottery|inheritance|million dollars)/i,
  
  // Multiple exclamation marks
  /!{2,}/,
  
  // All caps words
  /\b[A-Z]{4,}\b/,
  
  // Suspicious links
  /\[click here\]|\[here\]|\[link\]/i,
];

// AI classification using HuggingFace API (free tier)
async function classifyWithAI(text) {
  try {
    const response = await fetch('https://api-inference.huggingface.co/models/martin-ha/toxic-comment-model', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer hf_xxx', // You'll need to get a free API key from HuggingFace
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: text.substring(0, 512) }),
    });

    if (!response.ok) {
      throw new Error('AI API request failed');
    }

    const result = await response.json();
    
    if (result[0] && result[0].label === 'toxic') {
      return {
        classification: 'suspicious',
        confidence: result[0].score,
        explanation: 'AI detected potentially harmful content'
      };
    } else {
      return {
        classification: 'safe',
        confidence: result[0] ? result[0].score : 0.5,
        explanation: 'AI classified content as safe'
      };
    }
  } catch (error) {
    console.error('AI classification failed:', error);
    return null;
  }
}

// Pattern-based classification
function classifyWithPatterns(text) {
  const suspiciousPatterns = [];
  
  // Check phishing patterns
  phishingPatterns.forEach((pattern, index) => {
    if (pattern.test(text)) {
      suspiciousPatterns.push(`Phishing pattern ${index + 1}: ${pattern.source}`);
    }
  });
  
  // Check spam patterns
  spamPatterns.forEach((pattern, index) => {
    if (pattern.test(text)) {
      suspiciousPatterns.push(`Spam pattern ${index + 1}: ${pattern.source}`);
    }
  });
  
  if (suspiciousPatterns.length >= 3) {
    return {
      classification: 'suspicious',
      confidence: 0.8,
      explanation: `Detected ${suspiciousPatterns.length} suspicious patterns`,
      patterns: suspiciousPatterns
    };
  } else if (suspiciousPatterns.length >= 1) {
    return {
      classification: 'suspicious',
      confidence: 0.6,
      explanation: `Detected ${suspiciousPatterns.length} suspicious patterns`,
      patterns: suspiciousPatterns
    };
  } else {
    return {
      classification: 'safe',
      confidence: 0.7,
      explanation: 'No suspicious patterns detected',
      patterns: []
    };
  }
}

// Main email scanning function
exports.scanEmail = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      // Validate request
      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
      }

      const { emailText, userId } = req.body;

      if (!emailText || typeof emailText !== 'string') {
        return res.status(400).json({ error: 'Email text is required' });
      }

      if (emailText.length > 50000) {
        return res.status(400).json({ error: 'Email text too large (max 50KB)' });
      }

      const startTime = Date.now();

      // Try AI classification first
      let aiResult = await classifyWithAI(emailText);
      
      // Fallback to pattern-based detection
      const patternResult = classifyWithPatterns(emailText);
      
      // Combine results
      let finalResult;
      if (aiResult) {
        // Weight AI results more heavily
        const combinedConfidence = (aiResult.confidence * 0.7) + (patternResult.confidence * 0.3);
        finalResult = {
          classification: combinedConfidence >= 0.6 ? 'suspicious' : 'safe',
          confidence: combinedConfidence,
          explanation: `${aiResult.explanation}; ${patternResult.explanation}`,
          risk_level: combinedConfidence >= 0.7 ? 'high' : combinedConfidence >= 0.5 ? 'medium' : 'low',
          patterns: patternResult.patterns
        };
      } else {
        // Use pattern-based only
        finalResult = {
          ...patternResult,
          risk_level: patternResult.confidence >= 0.7 ? 'high' : patternResult.confidence >= 0.5 ? 'medium' : 'low'
        };
      }

      const processingTime = Date.now() - startTime;
      const scanId = uuidv4();
      const timestamp = admin.firestore.FieldValue.serverTimestamp();

      // Create response
      const response = {
        scan_id: scanId,
        classification: finalResult.classification,
        confidence: finalResult.confidence,
        explanation: finalResult.explanation,
        risk_level: finalResult.risk_level,
        suspicious_patterns: finalResult.patterns,
        timestamp: new Date().toISOString(),
        processing_time_ms: processingTime
      };

      // Store in Firestore
      await db.collection('scans').doc(scanId).set({
        scanId,
        userId: userId || null,
        emailTextHash: require('crypto').createHash('sha256').update(emailText).digest('hex').substring(0, 16),
        classification: finalResult.classification,
        confidence: finalResult.confidence,
        explanation: finalResult.explanation,
        risk_level: finalResult.risk_level,
        suspicious_patterns: finalResult.patterns,
        timestamp,
        processing_time_ms: processingTime,
        ip_address: req.ip
      });

      res.status(200).json(response);

    } catch (error) {
      console.error('Scan error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
});

// Get scan history
exports.getHistory = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
      }

      const { userId, limit = 10, offset = 0 } = req.query;
      
      let query = db.collection('scans').orderBy('timestamp', 'desc');
      
      if (userId) {
        query = query.where('userId', '==', userId);
      }
      
      const snapshot = await query.limit(parseInt(limit)).offset(parseInt(offset)).get();
      
      const history = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        history.push({
          scan_id: data.scanId,
          classification: data.classification,
          confidence: data.confidence,
          risk_level: data.risk_level,
          timestamp: data.timestamp.toDate().toISOString(),
          processing_time_ms: data.processing_time_ms
        });
      });

      res.status(200).json({
        history,
        count: history.length,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

    } catch (error) {
      console.error('History error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
});

// Health check
exports.health = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'Email Guardian Firebase Functions',
      version: '1.0.0'
    });
  });
});

// Create API key (Firebase Auth integration)
exports.createApiKey = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
      }

      const { name, description } = req.body;

      if (!name || typeof name !== 'string') {
        return res.status(400).json({ error: 'Name is required' });
      }

      const apiKey = uuidv4();
      const keyId = uuidv4();
      const timestamp = admin.firestore.FieldValue.serverTimestamp();

      // Store API key in Firestore
      await db.collection('api_keys').doc(keyId).set({
        keyId,
        keyHash: require('crypto').createHash('sha256').update(apiKey).digest('hex'),
        name,
        description: description || null,
        created_at: timestamp,
        last_used: null,
        is_active: true
      });

      res.status(200).json({
        api_key: apiKey,
        name,
        created_at: new Date().toISOString(),
        message: 'Store this key securely - it won\'t be shown again'
      });

    } catch (error) {
      console.error('API key creation error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
}); 