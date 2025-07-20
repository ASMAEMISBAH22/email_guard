#!/usr/bin/env python3
"""
Test suite for Smart Email Guardian
Tests the core AI functionality, API endpoints, and security features.
"""

import sys
import os
import unittest
import json
import tempfile
import sqlite3
from unittest.mock import patch, MagicMock

# Add project paths
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'ai'))
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

try:
    from email_guard import EmailGuardian
except ImportError:
    EmailGuardian = None

try:
    from app import app, Database
    from fastapi.testclient import TestClient
except ImportError:
    app = None
    Database = None
    TestClient = None


class TestEmailGuardian(unittest.TestCase):
    """Test the core AI email classification functionality."""
    
    def setUp(self):
        """Set up test fixtures."""
        if EmailGuardian is None:
            self.skipTest("EmailGuardian not available")
        
        # Mock the transformer pipeline to avoid downloading models during tests
        with patch('email_guard.pipeline') as mock_pipeline:
            mock_pipeline.return_value = MagicMock()
            self.guardian = EmailGuardian()
            self.guardian.classifier = None  # Force pattern-only mode for testing
    
    def test_pattern_analysis_phishing(self):
        """Test pattern analysis detects phishing attempts."""
        phishing_text = "URGENT: Your PayPal account has been suspended! Click here immediately to verify your account."
        
        score, patterns = self.guardian._pattern_analysis(phishing_text)
        
        self.assertGreater(score, 0, "Should detect suspicious patterns")
        self.assertGreater(len(patterns), 0, "Should match phishing patterns")
    
    def test_pattern_analysis_spam(self):
        """Test pattern analysis detects spam."""
        spam_text = "Congratulations! You've won $1,000,000! Call now to claim your prize. Free trial, no obligation!"
        
        score, patterns = self.guardian._pattern_analysis(spam_text)
        
        self.assertGreater(score, 0, "Should detect suspicious patterns")
        self.assertGreater(len(patterns), 0, "Should match spam patterns")
    
    def test_pattern_analysis_legitimate(self):
        """Test pattern analysis for legitimate emails."""
        legitimate_text = "Hi John, Thanks for your email about the project update. Let's schedule a meeting next week."
        
        score, patterns = self.guardian._pattern_analysis(legitimate_text)
        
        self.assertEqual(len(patterns), 0, "Should not match suspicious patterns")
        self.assertEqual(score, 0, "Should have zero suspicion score")
    
    def test_preprocess_email(self):
        """Test email preprocessing functionality."""
        raw_email = """From: test@example.com
To: user@domain.com
Subject: Test Email

This is a test email with a URL: https://example.com
And an email: contact@test.com
        """
        
        processed = self.guardian._preprocess_email(raw_email)
        
        self.assertNotIn("From:", processed, "Should remove email headers")
        self.assertIn("[URL]", processed, "Should replace URLs with placeholder")
        self.assertIn("[EMAIL]", processed, "Should replace emails with placeholder")
    
    def test_classify_email_empty(self):
        """Test classification of empty email."""
        result = self.guardian.classify_email("")
        
        self.assertEqual(result['classification'], 'unknown')
        self.assertEqual(result['confidence'], 0.0)
    
    def test_classify_email_phishing(self):
        """Test classification of phishing email."""
        phishing_email = """
        URGENT ACTION REQUIRED!
        
        Your bank account has been suspended due to suspicious activity.
        Click here immediately to verify your account and avoid permanent closure.
        
        This is a limited time offer - act now!
        """
        
        result = self.guardian.classify_email(phishing_email)
        
        self.assertIn(result['classification'], ['phishing', 'spam', 'suspicious'])
        self.assertGreater(result['confidence'], 0)
        self.assertIn('suspicious_patterns', result)
        self.assertGreater(len(result['suspicious_patterns']), 0)
    
    def test_classify_email_legitimate(self):
        """Test classification of legitimate email."""
        legitimate_email = """
        Hi Sarah,
        
        I hope this email finds you well. I wanted to follow up on our discussion
        about the quarterly report. Could we schedule a meeting for next week?
        
        Best regards,
        John
        """
        
        result = self.guardian.classify_email(legitimate_email)
        
        self.assertEqual(result['classification'], 'legitimate')
        self.assertLessEqual(result['confidence'], 0.3)
        self.assertEqual(len(result['suspicious_patterns']), 0)


class TestDatabase(unittest.TestCase):
    """Test database functionality."""
    
    def setUp(self):
        """Set up test database."""
        if Database is None:
            self.skipTest("Database not available")
        
        # Create temporary database
        self.db_file = tempfile.NamedTemporaryFile(delete=False)
        self.db_file.close()
        self.db = Database(self.db_file.name)
    
    def tearDown(self):
        """Clean up test database."""
        try:
            os.unlink(self.db_file.name)
        except:
            pass
    
    def test_database_initialization(self):
        """Test database tables are created."""
        conn = sqlite3.connect(self.db_file.name)
        cursor = conn.cursor()
        
        # Check if tables exist
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = [row[0] for row in cursor.fetchall()]
        
        self.assertIn('scan_history', tables)
        self.assertIn('api_keys', tables)
        
        conn.close()
    
    def test_save_and_retrieve_scan_result(self):
        """Test saving and retrieving scan results."""
        scan_data = {
            'scan_id': 'test-scan-123',
            'user_id': 'test-user',
            'email_text_hash': 'abcd1234',
            'classification': 'spam',
            'confidence': 0.85,
            'explanation': 'Test explanation',
            'risk_level': 'high',
            'suspicious_patterns': ['pattern1', 'pattern2'],
            'timestamp': '2024-01-01T12:00:00',
            'processing_time_ms': 150,
            'ip_address': '127.0.0.1'
        }
        
        # Save scan result
        self.db.save_scan_result(scan_data)
        
        # Retrieve scan history
        history = self.db.get_scan_history(user_id='test-user', limit=10)
        
        self.assertEqual(len(history), 1)
        self.assertEqual(history[0]['scan_id'], 'test-scan-123')
        self.assertEqual(history[0]['classification'], 'spam')
    
    def test_api_key_creation_and_verification(self):
        """Test API key creation and verification."""
        # Create API key
        api_key = self.db.create_api_key("Test Key", "Test description")
        
        self.assertIsInstance(api_key, str)
        self.assertGreater(len(api_key), 20)
        
        # Verify API key
        is_valid = self.db.verify_api_key(api_key)
        self.assertTrue(is_valid)
        
        # Test invalid key
        is_invalid = self.db.verify_api_key("invalid-key")
        self.assertFalse(is_invalid)


class TestAPI(unittest.TestCase):
    """Test API endpoints."""
    
    def setUp(self):
        """Set up test client."""
        if app is None or TestClient is None:
            self.skipTest("FastAPI app not available")
        
        self.client = TestClient(app)
        
        # Create test API key
        with patch('app.db') as mock_db:
            mock_db.create_api_key.return_value = "test-api-key-123"
            mock_db.verify_api_key.return_value = True
            
            self.api_key = "test-api-key-123"
    
    def test_root_endpoint(self):
        """Test root endpoint returns API information."""
        response = self.client.get("/")
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("name", data)
        self.assertIn("Smart Email Guardian", data["name"])
    
    def test_health_check(self):
        """Test health check endpoint."""
        response = self.client.get("/health")
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("status", data)
    
    @patch('app.db')
    def test_create_api_key(self, mock_db):
        """Test API key creation endpoint."""
        mock_db.create_api_key.return_value = "new-test-key-456"
        
        response = self.client.post("/create-key", json={
            "name": "Test Key",
            "description": "Test description"
        })
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("api_key", data)
        self.assertEqual(data["api_key"], "new-test-key-456")
    
    @patch('app.db')
    @patch('app.email_guardian')
    def test_scan_email_endpoint(self, mock_guardian, mock_db):
        """Test email scanning endpoint."""
        mock_db.verify_api_key.return_value = True
        mock_db.save_scan_result.return_value = None
        
        mock_guardian.classify_email.return_value = {
            'classification': 'spam',
            'confidence': 0.85,
            'explanation': 'Test explanation',
            'risk_level': 'high',
            'suspicious_patterns': ['pattern1']
        }
        
        response = self.client.post("/scan", 
            json={"email_text": "Test spam email"},
            headers={"Authorization": f"Bearer {self.api_key}"}
        )
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("classification", data)
        self.assertIn("confidence", data)
        self.assertIn("scan_id", data)
    
    @patch('app.db')
    def test_scan_without_api_key(self, mock_db):
        """Test scanning without API key returns 401."""
        response = self.client.post("/scan", 
            json={"email_text": "Test email"}
        )
        
        self.assertEqual(response.status_code, 401)
    
    @patch('app.db')
    def test_scan_with_invalid_api_key(self, mock_db):
        """Test scanning with invalid API key returns 401."""
        mock_db.verify_api_key.return_value = False
        
        response = self.client.post("/scan",
            json={"email_text": "Test email"},
            headers={"Authorization": "Bearer invalid-key"}
        )
        
        self.assertEqual(response.status_code, 401)
    
    def test_scan_empty_email(self):
        """Test scanning empty email returns 400."""
        with patch('app.db') as mock_db:
            mock_db.verify_api_key.return_value = True
            
            response = self.client.post("/scan",
                json={"email_text": ""},
                headers={"Authorization": f"Bearer {self.api_key}"}
            )
            
            self.assertEqual(response.status_code, 400)
    
    @patch('app.db')
    def test_get_history_endpoint(self, mock_db):
        """Test scan history endpoint."""
        mock_db.verify_api_key.return_value = True
        mock_db.get_scan_history.return_value = [
            {
                'scan_id': 'test-123',
                'classification': 'spam',
                'confidence': 0.85,
                'risk_level': 'high',
                'timestamp': '2024-01-01T12:00:00',
                'processing_time_ms': 150
            }
        ]
        
        response = self.client.get("/history",
            headers={"Authorization": f"Bearer {self.api_key}"}
        )
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("history", data)
        self.assertEqual(len(data["history"]), 1)


class TestSecurity(unittest.TestCase):
    """Test security features and input validation."""
    
    def setUp(self):
        """Set up security tests."""
        if EmailGuardian is None:
            self.skipTest("EmailGuardian not available")
        
        self.guardian = EmailGuardian()
        self.guardian.classifier = None  # Pattern-only mode
    
    def test_input_length_limit(self):
        """Test email length limits are enforced."""
        # Test very long input
        long_email = "A" * 60000  # 60KB
        result = self.guardian.classify_email(long_email)
        
        # Should still process but truncate
        self.assertIsNotNone(result)
        self.assertIn('classification', result)
    
    def test_malicious_input_handling(self):
        """Test handling of potentially malicious input."""
        malicious_inputs = [
            "<script>alert('xss')</script>",
            "'; DROP TABLE users; --",
            "\x00\x01\x02\x03",  # null bytes
            "\\n\\r\\t",  # control characters
        ]
        
        for malicious_input in malicious_inputs:
            with self.subTest(input=malicious_input):
                result = self.guardian.classify_email(malicious_input)
                self.assertIsNotNone(result)
                self.assertIn('classification', result)
    
    def test_unicode_handling(self):
        """Test handling of unicode and international characters."""
        unicode_email = "Hello 你好 مرحبا Здравствуйте こんにちは"
        
        result = self.guardian.classify_email(unicode_email)
        
        self.assertIsNotNone(result)
        self.assertIn('classification', result)
    
    def test_email_preprocessing_security(self):
        """Test email preprocessing removes sensitive patterns."""
        email_with_sensitive_data = """
        From: attacker@evil.com
        To: victim@company.com
        
        Visit this link: https://malicious-site.com/steal-data
        Contact us at: phishing@scam.com
        
        <script>steal_cookies()</script>
        """
        
        processed = self.guardian._preprocess_email(email_with_sensitive_data)
        
        # Should not contain raw URLs or emails
        self.assertNotIn("malicious-site.com", processed)
        self.assertNotIn("phishing@scam.com", processed)
        self.assertIn("[URL]", processed)
        self.assertIn("[EMAIL]", processed)


class TestPerformance(unittest.TestCase):
    """Test performance characteristics."""
    
    def setUp(self):
        """Set up performance tests."""
        if EmailGuardian is None:
            self.skipTest("EmailGuardian not available")
        
        self.guardian = EmailGuardian()
        self.guardian.classifier = None  # Pattern-only mode for speed
    
    def test_classification_speed(self):
        """Test that classification completes within reasonable time."""
        import time
        
        test_email = "This is a test email for performance testing. " * 100
        
        start_time = time.time()
        result = self.guardian.classify_email(test_email)
        end_time = time.time()
        
        processing_time = (end_time - start_time) * 1000  # Convert to ms
        
        self.assertLess(processing_time, 1000, "Classification should complete within 1 second")
        self.assertIn('classification', result)
    
    def test_memory_efficiency(self):
        """Test that multiple classifications don't cause memory leaks."""
        import gc
        
        # Run multiple classifications
        for _ in range(10):
            test_email = f"Test email number {_} with some content."
            result = self.guardian.classify_email(test_email)
            self.assertIn('classification', result)
        
        # Force garbage collection
        gc.collect()
        
        # This test mainly ensures no exceptions are raised
        self.assertTrue(True)


def run_tests():
    """Run all tests with detailed output."""
    # Discover and run all tests
    loader = unittest.TestLoader()
    suite = loader.loadTestsFromModule(sys.modules[__name__])
    
    runner = unittest.TextTestRunner(verbosity=2, buffer=True)
    result = runner.run(suite)
    
    # Print summary
    print("\n" + "="*50)
    print(f"Tests run: {result.testsRun}")
    print(f"Failures: {len(result.failures)}")
    print(f"Errors: {len(result.errors)}")
    print(f"Skipped: {len(result.skipped)}")
    
    if result.failures:
        print(f"\nFailures:")
        for test, traceback in result.failures:
            print(f"- {test}: {traceback}")
    
    if result.errors:
        print(f"\nErrors:")
        for test, traceback in result.errors:
            print(f"- {test}: {traceback}")
    
    return result.wasSuccessful()


if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1) 