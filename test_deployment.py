#!/usr/bin/env python3
"""
Test script for Email Guardian Render deployment
"""

import requests
import json
import sys
from typing import Optional

def test_deployment(base_url: str) -> bool:
    """Test the deployed API endpoints."""
    print(f"🧪 Testing Email Guardian API at: {base_url}")
    print("=" * 50)
    
    # Test 1: Health check
    print("1. Testing health endpoint...")
    try:
        response = requests.get(f"{base_url}/health", timeout=30)
        if response.status_code == 200:
            health_data = response.json()
            print(f"✅ Health check passed: {health_data.get('status', 'unknown')}")
            print(f"   AI Model: {health_data.get('ai_model', 'unknown')}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return False
    
    # Test 2: Create API key
    print("\n2. Testing API key creation...")
    try:
        response = requests.post(
            f"{base_url}/create-key",
            json={"name": "Test Deployment", "description": "Testing deployment"},
            timeout=30
        )
        if response.status_code == 200:
            key_data = response.json()
            api_key = key_data.get('api_key')
            print(f"✅ API key created: {api_key[:20]}...")
        else:
            print(f"❌ API key creation failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ API key creation error: {e}")
        return False
    
    # Test 3: Scan email
    print("\n3. Testing email scanning...")
    test_email = """
    Dear Customer,
    
    Your account has been suspended due to suspicious activity.
    Please click here immediately to verify your identity:
    http://suspicious-site.tk/verify
    
    This is urgent - your account will be deleted in 24 hours.
    
    Best regards,
    Support Team
    """
    
    try:
        headers = {"Authorization": f"Bearer {api_key}"}
        response = requests.post(
            f"{base_url}/scan",
            json={"email_text": test_email},
            headers=headers,
            timeout=60  # Longer timeout for AI model loading
        )
        if response.status_code == 200:
            scan_data = response.json()
            print(f"✅ Email scan successful!")
            print(f"   Classification: {scan_data.get('classification')}")
            print(f"   Confidence: {scan_data.get('confidence', 0):.2%}")
            print(f"   Risk Level: {scan_data.get('risk_level')}")
            print(f"   Processing Time: {scan_data.get('processing_time_ms')}ms")
        else:
            print(f"❌ Email scan failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Email scan error: {e}")
        return False
    
    # Test 4: Get history
    print("\n4. Testing history endpoint...")
    try:
        response = requests.get(
            f"{base_url}/history?limit=5",
            headers=headers,
            timeout=30
        )
        if response.status_code == 200:
            history_data = response.json()
            count = history_data.get('count', 0)
            print(f"✅ History retrieved: {count} records")
        else:
            print(f"❌ History retrieval failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ History retrieval error: {e}")
        return False
    
    print("\n🎉 All tests passed! Your Email Guardian API is working correctly.")
    return True

def main():
    """Main function."""
    if len(sys.argv) != 2:
        print("Usage: python test_deployment.py <API_BASE_URL>")
        print("Example: python test_deployment.py https://your-app.onrender.com")
        sys.exit(1)
    
    base_url = sys.argv[1].rstrip('/')
    
    if not base_url.startswith(('http://', 'https://')):
        print("❌ Please provide a valid URL starting with http:// or https://")
        sys.exit(1)
    
    success = test_deployment(base_url)
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main() 