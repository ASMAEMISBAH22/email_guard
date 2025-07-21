#!/usr/bin/env python3
"""
Smart Email Guardian - AI Core Logic
CPU-only email classification using HuggingFace transformers and pattern matching.
"""

import re
import json
import time
from typing import Dict, List, Optional
import argparse
from pathlib import Path

try:
    from transformers import pipeline
    import torch
except ImportError:
    print("Error: transformers and torch not installed. Run: pip install transformers torch")
    exit(1)


class EmailGuardian:
    """AI-powered email classification system."""
    
    def __init__(self, model_name: str = "martin-ha/toxic-comment-model"):
        """Initialize the email guardian with AI model."""
        self.model_name = model_name
        self.classifier = None
        self.load_model()
        self.setup_patterns()
    
    def load_model(self):
        """Load the HuggingFace model for CPU inference."""
        try:
            print(f"🤖 Loading AI model: {self.model_name}")
            self.classifier = pipeline(
                "text-classification",
                model=self.model_name,
                device=-1  # Force CPU usage
            )
            print("✅ AI model loaded successfully")
        except Exception as e:
            print(f"❌ Failed to load AI model: {e}")
            print("⚠️  Falling back to pattern-based detection only")
            self.classifier = None
    
    def setup_patterns(self):
        """Setup regex patterns for phishing/spam detection."""
        self.phishing_patterns = [
            # Urgency patterns
            r'\b(urgent|immediate|action required|account suspended|verify now)\b',
            r'\b(limited time|expires soon|last chance|final notice)\b',
            
            # Financial threats
            r'\b(account locked|payment overdue|billing issue|refund pending)\b',
            r'\b(credit card|bank account|social security|password expired)\b',
            
            # Suspicious URLs
            r'https?://[^\s]*\.(tk|ml|ga|cf|gq|xyz|top|club|online|site)\b',
            r'https?://[^\s]*\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b',
            
            # Suspicious domains
            r'\b(amaz0n|paypa1|goog1e|faceb00k|app1e|micr0soft)\b',
            
            # Personal information requests
            r'\b(password|username|ssn|credit card|bank account|mother maiden)\b',
            
            # Suspicious attachments
            r'\b\.(exe|bat|scr|pif|com|vbs|js|jar)\b',
            
            # Generic greetings
            r'\b(dear user|dear customer|dear sir|dear madam)\b',
            
            # Suspicious sender patterns
            r'from:\s*[^\s]*@[^\s]*\.(tk|ml|ga|cf|gq|xyz|top|club|online|site)',
        ]
        
        self.spam_patterns = [
            # Marketing keywords
            r'\b(free|discount|offer|limited|sale|deal|save money)\b',
            r'\b(click here|buy now|order now|subscribe|unsubscribe)\b',
            
            # Suspicious subject patterns
            r'\b(viagra|cialis|weight loss|diet pills|make money fast)\b',
            r'\b(winner|prize|lottery|inheritance|million dollars)\b',
            
            # Multiple exclamation marks
            r'!{2,}',
            
            # All caps words
            r'\b[A-Z]{4,}\b',
            
            # Suspicious links
            r'\[click here\]|\[here\]|\[link\]',
        ]
    
    def classify_email(self, email_text: str) -> Dict:
        """Classify email content using AI and pattern matching."""
        start_time = time.time()
        
        # Clean and prepare text
        clean_text = self.preprocess_text(email_text)
        
        # AI classification
        ai_result = self.ai_classify(clean_text)
        
        # Pattern-based detection
        pattern_result = self.pattern_classify(clean_text)
        
        # Combine results
        final_result = self.combine_results(ai_result, pattern_result)
        
        # Calculate processing time
        processing_time = time.time() - start_time
        
        return {
            'classification': final_result['classification'],
            'confidence': final_result['confidence'],
            'explanation': final_result['explanation'],
            'risk_level': final_result['risk_level'],
            'suspicious_patterns': final_result['patterns'],
            'processing_time': processing_time
        }
    
    def preprocess_text(self, text: str) -> str:
        """Clean and normalize text for analysis."""
        # Remove HTML tags
        text = re.sub(r'<[^>]+>', '', text)
        
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        
        # Convert to lowercase
        text = text.lower()
        
        return text.strip()
    
    def ai_classify(self, text: str) -> Dict:
        """Classify text using AI model."""
        if not self.classifier:
            return {
                'classification': 'unknown',
                'confidence': 0.5,
                'explanation': 'AI model not available'
            }
        
        try:
            result = self.classifier(text[:512])  # Limit text length
            
            # Map toxic classification to our categories
            if result[0]['label'] == 'toxic':
                return {
                    'classification': 'suspicious',
                    'confidence': result[0]['score'],
                    'explanation': 'AI detected potentially harmful content'
                }
            else:
                return {
                    'classification': 'safe',
                    'confidence': result[0]['score'],
                    'explanation': 'AI classified content as safe'
                }
        except Exception as e:
            return {
                'classification': 'unknown',
                'confidence': 0.5,
                'explanation': f'AI classification failed: {str(e)}'
            }
    
    def pattern_classify(self, text: str) -> Dict:
        """Classify text using pattern matching."""
        suspicious_patterns = []
        
        # Check phishing patterns
        for pattern in self.phishing_patterns:
            if re.search(pattern, text, re.IGNORECASE):
                suspicious_patterns.append(f"Phishing pattern: {pattern}")
        
        # Check spam patterns
        for pattern in self.spam_patterns:
            if re.search(pattern, text, re.IGNORECASE):
                suspicious_patterns.append(f"Spam pattern: {pattern}")
        
        # Determine classification based on patterns
        if len(suspicious_patterns) >= 3:
            return {
                'classification': 'suspicious',
                'confidence': 0.8,
                'explanation': f'Detected {len(suspicious_patterns)} suspicious patterns',
                'patterns': suspicious_patterns
            }
        elif len(suspicious_patterns) >= 1:
            return {
                'classification': 'suspicious',
                'confidence': 0.6,
                'explanation': f'Detected {len(suspicious_patterns)} suspicious patterns',
                'patterns': suspicious_patterns
            }
        else:
            return {
                'classification': 'safe',
                'confidence': 0.7,
                'explanation': 'No suspicious patterns detected',
                'patterns': []
            }
    
    def combine_results(self, ai_result: Dict, pattern_result: Dict) -> Dict:
        """Combine AI and pattern results."""
        # Weight AI results more heavily if available
        if ai_result['classification'] != 'unknown':
            ai_weight = 0.7
            pattern_weight = 0.3
        else:
            ai_weight = 0.0
            pattern_weight = 1.0
        
        # Calculate combined confidence
        combined_confidence = (
            ai_result['confidence'] * ai_weight +
            pattern_result['confidence'] * pattern_weight
        )
        
        # Determine final classification
        if combined_confidence >= 0.7:
            classification = 'suspicious'
            risk_level = 'high'
        elif combined_confidence >= 0.5:
            classification = 'suspicious'
            risk_level = 'medium'
        else:
            classification = 'safe'
            risk_level = 'low'
        
        # Combine explanations
        explanations = []
        if ai_result['explanation']:
            explanations.append(ai_result['explanation'])
        if pattern_result['explanation']:
            explanations.append(pattern_result['explanation'])
        
        combined_explanation = '; '.join(explanations)
        
        return {
            'classification': classification,
            'confidence': combined_confidence,
            'explanation': combined_explanation,
            'risk_level': risk_level,
            'patterns': pattern_result.get('patterns', [])
        }


def main():
    """CLI interface for email classification."""
    parser = argparse.ArgumentParser(description="Smart Email Guardian CLI")
    parser.add_argument("--email", "-e", help="Email text to analyze")
    parser.add_argument("--file", "-f", help="File containing email text")
    parser.add_argument("--json", "-j", action="store_true", help="Output in JSON format")
    parser.add_argument("--pretty", "-p", action="store_true", help="Pretty print output")
    
    args = parser.parse_args()
    
    # Initialize email guardian
    guardian = EmailGuardian()
    
    # Get email text
    email_text = None
    if args.email:
        email_text = args.email
    elif args.file:
        try:
            with open(args.file, 'r', encoding='utf-8') as f:
                email_text = f.read()
        except Exception as e:
            print(f"Error reading file: {e}")
            return 1
    else:
        # Interactive mode
        print("Enter email text (Ctrl+D to finish):")
        try:
            email_text = ""
            while True:
                line = input()
                email_text += line + "\n"
        except EOFError:
            pass
    
    if not email_text or not email_text.strip():
        print("No email text provided")
        return 1
    
    # Analyze email
    try:
        result = guardian.classify_email(email_text)
        
        if args.json:
            print(json.dumps(result, indent=2))
        elif args.pretty:
            print("🔍 Email Analysis Results")
            print("=" * 50)
            print(f"📧 Classification: {result['classification'].upper()}")
            print(f"🎯 Confidence: {result['confidence']:.2%}")
            print(f"⚠️  Risk Level: {result['risk_level'].upper()}")
            print(f"⏱️  Processing Time: {result['processing_time']:.3f}s")
            print(f"📝 Explanation: {result['explanation']}")
            
            if result['suspicious_patterns']:
                print("\n🚨 Suspicious Patterns Detected:")
                for pattern in result['suspicious_patterns']:
                    print(f"  • {pattern}")
            else:
                print("\n✅ No suspicious patterns detected")
        else:
            print(f"Classification: {result['classification']}")
            print(f"Confidence: {result['confidence']:.2%}")
            print(f"Risk Level: {result['risk_level']}")
            print(f"Explanation: {result['explanation']}")
        
        return 0
        
    except Exception as e:
        print(f"Error analyzing email: {e}")
        return 1


if __name__ == "__main__":
    exit(main()) 