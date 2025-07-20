# System Architecture: Smart Email Guardian

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           Smart Email Guardian System                           │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐             │
│  │   Web Browser   │    │   CLI Tool      │    │   API Client    │             │
│  │                 │    │                 │    │                 │             │
│  │ • React App     │    │ • email_guard.py│    │ • External Apps │             │
│  │ • Email Scanner │    │ • Direct AI     │    │ • Integrations  │             │
│  │ • History View  │    │ • File Input    │    │ • Third Party   │             │
│  │ • Analytics     │    │ • Batch Process │    │ • Services      │             │
│  └─────────────────┘    └─────────────────┘    └─────────────────┘             │
│           │                       │                       │                    │
│           │              ┌─────────────────┐              │                    │
│           │              │                 │              │                    │
│           └──────────────►│   Load Balancer │◄─────────────┘                    │
│                          │   (Optional)    │                                   │
│                          └─────────────────┘                                   │
│                                   │                                            │
├───────────────────────────────────┼────────────────────────────────────────────┤
│                                   ▼                                            │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        FastAPI Backend Server                          │   │
│  │                                                                         │   │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐        │   │
│  │  │ Authentication  │  │ Rate Limiting   │  │ Input Validation│        │   │
│  │  │                 │  │                 │  │                 │        │   │
│  │  │ • API Keys      │  │ • IP Tracking   │  │ • Content Check │        │   │
│  │  │ • Token Auth    │  │ • Request Count │  │ • Size Limits   │        │   │
│  │  │ • Access Control│  │ • Time Windows  │  │ • Sanitization  │        │   │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘        │   │
│  │                                   │                                    │   │
│  │  ┌───────────────────────────────────────────────────────────────────┐│   │
│  │  │                    API Endpoints                                  ││   │
│  │  │                                                                   ││   │
│  │  │  POST /scan           GET /history        POST /create-key       ││   │
│  │  │  • Email Analysis     • Scan Results     • API Key Gen          ││   │
│  │  │  • Real-time         • Filtering        • Access Management     ││   │
│  │  │  • Confidence Score  • Pagination       • Security              ││   │
│  │  │                                                                   ││   │
│  │  │  GET /health          GET /             • CORS Headers           ││   │
│  │  │  • System Status      • API Info        • Security Headers       ││   │
│  │  │  • Model Health       • Documentation   • Error Handling         ││   │
│  │  └───────────────────────────────────────────────────────────────────┘│   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                   │                                            │
├───────────────────────────────────┼────────────────────────────────────────────┤
│                                   ▼                                            │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                           AI Processing Layer                          │   │
│  │                                                                         │   │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐        │   │
│  │  │ Email Guardian  │  │ Preprocessing   │  │ Pattern Engine  │        │   │
│  │  │                 │  │                 │  │                 │        │   │
│  │  │ • Model Loading │  │ • Text Cleaning │  │ • Regex Rules   │        │   │
│  │  │ • CPU Inference │  │ • URL Masking   │  │ • Phishing Sigs │        │   │
│  │  │ • Confidence    │  │ • Email Masking │  │ • Spam Patterns │        │   │
│  │  │ • Classification│  │ • Header Remove │  │ • Threat Intel  │        │   │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘        │   │
│  │                                   │                                    │   │
│  │  ┌───────────────────────────────────────────────────────────────────┐│   │
│  │  │                 HuggingFace Integration                           ││   │
│  │  │                                                                   ││   │
│  │  │  • Transformer Models    • CPU-Only Inference                    ││   │
│  │  │  • Tokenization          • Model Caching                         ││   │
│  │  │  • Text Classification   • Error Handling                        ││   │
│  │  │  • Confidence Scoring    • Fallback Support                      ││   │
│  │  └───────────────────────────────────────────────────────────────────┘│   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                   │                                            │
├───────────────────────────────────┼────────────────────────────────────────────┤
│                                   ▼                                            │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                         Data Storage Layer                             │   │
│  │                                                                         │   │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐        │   │
│  │  │ SQLite Database │  │ Model Cache     │  │ Session Storage │        │   │
│  │  │                 │  │                 │  │                 │        │   │
│  │  │ • Scan History  │  │ • Transformer   │  │ • Rate Limits   │        │   │
│  │  │ • API Keys      │  │ • Tokenizers    │  │ • Request Count │        │   │
│  │  │ • User Data     │  │ • Vocabularies  │  │ • IP Tracking   │        │   │
│  │  │ • Audit Logs    │  │ • Config Files  │  │ • Session Data  │        │   │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘        │   │
│  │                                                                         │   │
│  │  ┌───────────────────────────────────────────────────────────────────┐│   │
│  │  │                      Security Features                            ││   │
│  │  │                                                                   ││   │
│  │  │  • No Email Content Storage  • Hash-Only Audit Logging           ││   │
│  │  │  • Encrypted API Keys        • Secure Session Management         ││   │
│  │  │  • Audit Trail              • Data Retention Policies            ││   │
│  │  │  • Privacy Protection       • GDPR Compliance                    ││   │
│  │  └───────────────────────────────────────────────────────────────────┘│   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Component Details

### Frontend Layer (React Web App)

**Purpose**: User interface for email scanning and management
**Technology**: React 18, Tailwind CSS, Axios
**Key Features**:
- Responsive design with modern UI/UX
- Real-time email scanning interface
- Historical scan data visualization
- API key management dashboard
- Built-in sample emails for testing

**Components**:
- `EmailScanner`: Main scanning interface with input validation
- `ScanHistory`: Paginated history with filtering and sorting
- `Stats`: Analytics dashboard with charts and metrics
- `ApiKeyManager`: API key creation and management

### Backend Layer (FastAPI API Server)

**Purpose**: Secure API service with authentication and rate limiting
**Technology**: FastAPI, SQLite, Pydantic, uvicorn
**Key Features**:
- RESTful API with automatic documentation
- Token-based authentication system
- Rate limiting and request validation
- Comprehensive error handling

**Endpoints**:
- `POST /scan`: Email analysis with confidence scoring
- `GET /history`: Scan history retrieval with pagination
- `POST /create-key`: API key generation
- `GET /health`: System health monitoring

### AI Processing Layer (Email Guardian)

**Purpose**: CPU-only AI inference with pattern-based fallback
**Technology**: HuggingFace Transformers, PyTorch, scikit-learn
**Key Features**:
- Dual-layer detection (AI + patterns)
- CPU-optimized inference pipeline
- Comprehensive email preprocessing
- Robust error handling and fallback

**Components**:
- `EmailGuardian`: Main classification engine
- Preprocessing pipeline for security and performance
- Pattern-based detection for reliability
- Model loading and caching system

### Data Storage Layer

**Purpose**: Secure data persistence with privacy protection
**Technology**: SQLite, file system cache
**Key Features**:
- Hash-only email content logging
- Secure API key storage
- Session-based rate limiting
- Audit trail maintenance

**Storage Types**:
- **SQLite Database**: Structured data (API keys, scan history)
- **Model Cache**: HuggingFace model artifacts
- **Session Storage**: Temporary rate limiting data

## Security Architecture

### Authentication Flow
```
1. User → Create API Key → Backend validates → Generate token
2. User → Request with token → Backend verifies → Allow/Deny
3. Backend → Hash API key → Store securely → Track usage
```

### Input Validation Pipeline
```
Email Content → Size Check → Content Validation → Sanitization → AI Processing
             ↓              ↓                  ↓              ↓
          Max 50KB      Script Detection   URL/Email Mask   Safe Processing
```

### Privacy Protection
```
Email Content → Hash Generation → Store Hash Only → Audit Trail
             ↓                  ↓                  ↓
        Memory Only        No Content Store    Privacy Compliant
```

## Deployment Architecture

### Development Environment
```
Local Machine:
├── Backend (localhost:8000)
├── Frontend (localhost:3000)
├── SQLite Database (local file)
└── Model Cache (local directory)
```

### Production Environment
```
Cloud Platform:
├── Backend Service (Gunicorn + FastAPI)
├── Static Frontend (CDN/Web Server)
├── Database (Managed SQLite/PostgreSQL)
└── Model Storage (Persistent Volume)
```

## Data Flow

### Email Scanning Process
```
1. User submits email content via web interface or API
2. Frontend/CLI sends POST request to /scan endpoint
3. Backend validates API key and request format
4. Rate limiting checks current request count
5. Input validation sanitizes email content
6. AI processing layer analyzes email:
   a. Preprocessing cleans and prepares text
   b. HuggingFace model performs classification
   c. Pattern engine provides backup analysis
   d. Results are combined and scored
7. Response includes classification, confidence, and explanation
8. Audit data (hash only) is stored in database
9. Result is returned to user interface
```

### API Key Management
```
1. User requests new API key via web interface
2. Backend generates cryptographically secure token
3. Token is hashed using SHA-256 for storage
4. Original token is returned to user (one-time display)
5. Future API requests include token in Authorization header
6. Backend verifies token by hashing and comparing
7. Usage is tracked and rate limits are enforced
```

## Scalability Considerations

### Horizontal Scaling
- Stateless API design allows multiple backend instances
- Model loading can be optimized with shared caches
- Database can be upgraded to PostgreSQL for multi-instance support

### Performance Optimization
- Model quantization for faster CPU inference
- Response caching for repeated requests
- Database indexing for faster queries
- CDN for frontend asset delivery

### Monitoring & Observability
- Health check endpoints for load balancer integration
- Structured logging for analysis and debugging
- Performance metrics collection
- Security event monitoring

This architecture provides a solid foundation for educational use while being scalable enough for production deployment. 