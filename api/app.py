#!/usr/bin/env python3
"""
Smart Email Guardian Backend API
FastAPI-based secure backend for email classification service.
"""

import os
import sys
import json
import uuid
import hashlib
import sqlite3
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import secrets
import re

from fastapi import FastAPI, HTTPException, Depends, Request, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, validator
import uvicorn

# Add the ai module to the path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'ai'))

try:
    from email_guard import EmailGuardian
except ImportError:
    print("Error: Could not import EmailGuardian. Make sure ai/email_guard.py exists.")
    # For Vercel serverless, we'll create a fallback
    class EmailGuardian:
        def __init__(self):
            self.model = None
            self.patterns = []
        
        def classify_email(self, email_text: str) -> dict:
            return {
                "classification": "unknown",
                "confidence": 0.5,
                "explanation": "AI model not available in serverless environment",
                "risk_level": "medium",
                "suspicious_patterns": [],
                "ai_score": 0.5,
                "pattern_score": 0.5
            }


# Pydantic models for request/response validation
class EmailScanRequest(BaseModel):
    """Request model for email scanning."""
    email_text: str
    user_id: Optional[str] = None
    
    @validator('email_text')
    def validate_email_text(cls, v):
        if not v or not v.strip():
            raise ValueError('Email text cannot be empty')
        if len(v) > 50000:  # 50KB limit
            raise ValueError('Email text too large (max 50KB)')
        # Basic HTML/script injection prevention
        if re.search(r'<script.*?>.*?</script>', v, re.IGNORECASE | re.DOTALL):
            raise ValueError('Script content not allowed')
        return v.strip()


class EmailScanResponse(BaseModel):
    """Response model for email scanning."""
    scan_id: str
    classification: str
    confidence: float
    explanation: str
    risk_level: str
    suspicious_patterns: List[str]
    timestamp: str
    processing_time_ms: int


class HistoryRequest(BaseModel):
    """Request model for retrieving scan history."""
    user_id: Optional[str] = None
    limit: Optional[int] = 10
    offset: Optional[int] = 0
    
    @validator('limit')
    def validate_limit(cls, v):
        if v is not None and (v < 1 or v > 100):
            raise ValueError('Limit must be between 1 and 100')
        return v


class APIKeyRequest(BaseModel):
    """Request model for API key generation."""
    name: str
    description: Optional[str] = None
    
    @validator('name')
    def validate_name(cls, v):
        if not v or len(v.strip()) < 3:
            raise ValueError('Name must be at least 3 characters')
        if len(v) > 50:
            raise ValueError('Name too long (max 50 characters)')
        return v.strip()


# Database setup
class Database:
    """Simple SQLite database manager."""
    
    def __init__(self, db_path: str = "/tmp/email_guardian.db"):
        self.db_path = db_path
        self.init_db()
    
    def init_db(self):
        """Initialize database tables."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Scan history table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS scan_history (
                scan_id TEXT PRIMARY KEY,
                user_id TEXT,
                email_text_hash TEXT,
                classification TEXT,
                confidence REAL,
                explanation TEXT,
                risk_level TEXT,
                suspicious_patterns TEXT,
                timestamp TEXT,
                processing_time_ms INTEGER,
                ip_address TEXT
            )
        ''')
        
        # API keys table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS api_keys (
                key_id TEXT PRIMARY KEY,
                key_hash TEXT UNIQUE,
                name TEXT,
                description TEXT,
                created_at TEXT,
                last_used TEXT,
                is_active BOOLEAN DEFAULT 1
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def save_scan_result(self, scan_data: Dict):
        """Save scan result to database."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO scan_history 
            (scan_id, user_id, email_text_hash, classification, confidence, 
             explanation, risk_level, suspicious_patterns, timestamp, 
             processing_time_ms, ip_address)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            scan_data['scan_id'],
            scan_data.get('user_id'),
            scan_data['email_text_hash'],
            scan_data['classification'],
            scan_data['confidence'],
            scan_data['explanation'],
            scan_data['risk_level'],
            json.dumps(scan_data['suspicious_patterns']),
            scan_data['timestamp'],
            scan_data['processing_time_ms'],
            scan_data.get('ip_address')
        ))
        
        conn.commit()
        conn.close()
    
    def get_scan_history(self, user_id: Optional[str] = None, limit: int = 10, offset: int = 0) -> List[Dict]:
        """Retrieve scan history."""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        if user_id:
            cursor.execute('''
                SELECT scan_id, classification, confidence, risk_level, 
                       timestamp, processing_time_ms
                FROM scan_history 
                WHERE user_id = ?
                ORDER BY timestamp DESC 
                LIMIT ? OFFSET ?
            ''', (user_id, limit, offset))
        else:
            cursor.execute('''
                SELECT scan_id, classification, confidence, risk_level, 
                       timestamp, processing_time_ms
                FROM scan_history 
                ORDER BY timestamp DESC 
                LIMIT ? OFFSET ?
            ''', (limit, offset))
        
        results = []
        for row in cursor.fetchall():
            results.append({
                'scan_id': row[0],
                'classification': row[1],
                'confidence': row[2],
                'risk_level': row[3],
                'timestamp': row[4],
                'processing_time_ms': row[5]
            })
        
        conn.close()
        return results
    
    def create_api_key(self, name: str, description: Optional[str] = None) -> str:
        """Create a new API key."""
        key = secrets.token_urlsafe(32)
        key_hash = hashlib.sha256(key.encode()).hexdigest()
        key_id = str(uuid.uuid4())
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO api_keys (key_id, key_hash, name, description, created_at)
            VALUES (?, ?, ?, ?, ?)
        ''', (key_id, key_hash, name, description, datetime.utcnow().isoformat()))
        
        conn.commit()
        conn.close()
        
        return key
    
    def verify_api_key(self, key: str) -> bool:
        """Verify an API key."""
        key_hash = hashlib.sha256(key.encode()).hexdigest()
        
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT key_id FROM api_keys 
            WHERE key_hash = ? AND is_active = 1
        ''', (key_hash,))
        
        result = cursor.fetchone()
        
        if result:
            # Update last used timestamp
            cursor.execute('''
                UPDATE api_keys 
                SET last_used = ? 
                WHERE key_hash = ?
            ''', (datetime.utcnow().isoformat(), key_hash))
            conn.commit()
        
        conn.close()
        return result is not None


# Initialize components
app = FastAPI(
    title="Smart Email Guardian API",
    description="AI-Powered Spam & Phishing Detection Service",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://127.0.0.1:3000",
        "https://*.vercel.app",  # Allow all Vercel subdomains
        "https://*.vercel.app"  # Allow Vercel preview deployments
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Initialize database and AI model
db = Database()
email_guardian = EmailGuardian()

# Security
security = HTTPBearer()


async def verify_api_key(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify API key authentication."""
    if not db.verify_api_key(credentials.credentials):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired API key"
        )
    return credentials.credentials


# Rate limiting (simple in-memory implementation)
request_counts = {}

def rate_limit_check(request: Request, max_requests: int = 100, window_minutes: int = 60):
    """Simple rate limiting."""
    client_ip = request.client.host
    now = datetime.utcnow()
    
    if client_ip not in request_counts:
        request_counts[client_ip] = []
    
    # Remove old requests outside the window
    request_counts[client_ip] = [
        req_time for req_time in request_counts[client_ip]
        if now - req_time < timedelta(minutes=window_minutes)
    ]
    
    if len(request_counts[client_ip]) >= max_requests:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded"
        )
    
    request_counts[client_ip].append(now)


# API Endpoints
@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "name": "Smart Email Guardian API",
        "version": "1.0.0",
        "description": "AI-Powered Spam & Phishing Detection Service",
        "endpoints": {
            "/scan": "POST - Analyze email content",
            "/history": "GET - Retrieve scan history",
            "/create-key": "POST - Generate API key",
            "/health": "GET - Health check"
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    try:
        # Test database connection
        conn = sqlite3.connect(db.db_path)
        conn.close()
        
        return {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "ai_model": email_guardian.model_name,
            "database": "connected"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Service unhealthy: {str(e)}"
        )


@app.post("/create-key")
async def create_api_key(request: APIKeyRequest):
    """Create a new API key."""
    try:
        api_key = db.create_api_key(request.name, request.description)
        return {
            "api_key": api_key,
            "name": request.name,
            "created_at": datetime.utcnow().isoformat(),
            "message": "Store this key securely - it won't be shown again"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create API key: {str(e)}"
        )


@app.post("/scan", response_model=EmailScanResponse)
async def scan_email(
    request: EmailScanRequest,
    http_request: Request,
    api_key: str = Depends(verify_api_key)
):
    """Analyze email content for phishing/spam detection."""
    # Rate limiting
    rate_limit_check(http_request)
    
    try:
        start_time = datetime.utcnow()
        
        # Analyze email
        result = email_guardian.classify_email(request.email_text)
        
        end_time = datetime.utcnow()
        processing_time_ms = int((end_time - start_time).total_seconds() * 1000)
        
        # Generate scan ID and prepare response
        scan_id = str(uuid.uuid4())
        timestamp = end_time.isoformat()
        
        # Create response
        response = EmailScanResponse(
            scan_id=scan_id,
            classification=result['classification'],
            confidence=result['confidence'],
            explanation=result['explanation'],
            risk_level=result['risk_level'],
            suspicious_patterns=result['suspicious_patterns'],
            timestamp=timestamp,
            processing_time_ms=processing_time_ms
        )
        
        # Save to database (hash email content for privacy)
        email_hash = hashlib.sha256(request.email_text.encode()).hexdigest()[:16]
        scan_data = {
            'scan_id': scan_id,
            'user_id': request.user_id,
            'email_text_hash': email_hash,
            'classification': result['classification'],
            'confidence': result['confidence'],
            'explanation': result['explanation'],
            'risk_level': result['risk_level'],
            'suspicious_patterns': result['suspicious_patterns'],
            'timestamp': timestamp,
            'processing_time_ms': processing_time_ms,
            'ip_address': http_request.client.host
        }
        
        db.save_scan_result(scan_data)
        
        return response
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analysis failed: {str(e)}"
        )


@app.get("/history")
async def get_scan_history(
    user_id: Optional[str] = None,
    limit: int = 10,
    offset: int = 0,
    api_key: str = Depends(verify_api_key)
):
    """Retrieve scan history."""
    try:
        # Validate parameters
        if limit < 1 or limit > 100:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Limit must be between 1 and 100"
            )
        
        if offset < 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Offset must be non-negative"
            )
        
        history = db.get_scan_history(user_id, limit, offset)
        
        return {
            "history": history,
            "count": len(history),
            "limit": limit,
            "offset": offset
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve history: {str(e)}"
        )


# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Custom HTTP exception handler."""
    return {
        "error": True,
        "status_code": exc.status_code,
        "message": exc.detail,
        "timestamp": datetime.utcnow().isoformat()
    }


if __name__ == "__main__":
    # Create a default API key for development
    try:
        dev_key = db.create_api_key("development", "Default development key")
        print(f"🔑 Development API Key: {dev_key}")
        print("⚠️  Store this key securely!")
    except:
        print("Note: Development key may already exist")
    
    print("🚀 Starting Email Guardian API server...")
    port = int(os.environ.get("PORT", 8000))  # Railway uses $PORT environment variable
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=port,
        reload=False,  # Disable reload in production
        log_level="info"
    ) 