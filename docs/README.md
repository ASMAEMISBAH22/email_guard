# 🛡️ Smart Email Guardian: AI-Powered Spam & Phishing Detection Toolkit

> **A comprehensive cybersecurity toolkit that uses AI to detect phishing and spam emails with CPU-only inference, built for educational purposes and real-world application.**

[![Python Version](https://img.shields.io/badge/python-3.8%2B-blue.svg)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104%2B-009688.svg)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.2%2B-61dafb.svg)](https://reactjs.org)
[![Security](https://img.shields.io/badge/security-first-green.svg)](docs/security_notes.md)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 🎯 Project Overview

Smart Email Guardian is a lightweight, AI-enhanced security tool designed for cybersecurity education and practical application. It combines modern AI techniques with traditional pattern-based detection to identify phishing attempts and spam emails, all while running entirely on CPU for accessibility and cost-effectiveness.

### ✨ Key Features

- **🧠 AI-Powered Detection**: Uses HuggingFace transformers for intelligent email analysis
- **⚡ CPU-Only Operation**: No GPU required - runs on any modern computer
- **🔒 Privacy-First**: No email content storage, hash-only audit logging
- **🌐 Full-Stack Solution**: Complete CLI, API, and web interface
- **🛡️ Security-Focused**: Built with cybersecurity best practices
- **📊 Analytics Dashboard**: Comprehensive scanning statistics and insights
- **🔑 API-First Design**: RESTful API with token-based authentication

### 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Web    │    │   FastAPI       │    │   AI Engine     │
│   Frontend      │◄──►│   Backend       │◄──►│   (CPU-only)    │
│                 │    │                 │    │                 │
│ • Email Scanner │    │ • Authentication│    │ • HuggingFace   │
│ • History View  │    │ • Rate Limiting │    │ • Pattern Match │
│ • Analytics     │    │ • Input Validation   │ • Preprocessing │
│ • API Key Mgmt  │    │ • Audit Logging │    │ • Classification│
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         │              │   SQLite DB     │              │
         └──────────────►│                 │◄─────────────┘
                        │ • Scan History  │
                        │ • API Keys      │
                        │ • Rate Limits   │
                        └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+** with pip
- **Node.js 16+** with npm (for frontend)
- **4GB RAM** minimum for AI model loading
- **Modern web browser** (Chrome, Firefox, Safari, Edge)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/email_guard.git
cd email_guard
```

### 2. Backend Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the backend server
cd backend
python app.py
```

The backend will start on `http://localhost:8000` and automatically generate a development API key.

### 3. Frontend Setup

```bash
# In a new terminal
cd frontend
npm install
npm start
```

The frontend will start on `http://localhost:3000` and automatically proxy API requests to the backend.

### 4. CLI Usage

```bash
# Basic email scanning
cd ai
python email_guard.py --text "URGENT: Your account will be suspended!"

# Scan from file
python email_guard.py --file sample_email.txt

# Pretty formatted output
python email_guard.py --text "Hello, this is a legitimate email" --format pretty
```

## 📖 Detailed Usage Guide

### 🖥️ Command Line Interface

The CLI tool (`ai/email_guard.py`) provides instant email analysis:

```bash
# Basic usage
python email_guard.py --text "Your email content here"

# File input
python email_guard.py --file path/to/email.txt

# Stdin input
echo "Email content" | python email_guard.py --stdin

# Custom model
python email_guard.py --text "Email content" --model "distilbert-base-uncased"

# JSON output (default)
python email_guard.py --text "Email content" --format json

# Human-readable output
python email_guard.py --text "Email content" --format pretty
```

**Example Output:**
```json
{
  "classification": "phishing",
  "confidence": 0.857,
  "explanation": "AI model confidence: 0.751 | Suspicious patterns detected: 3",
  "risk_level": "high",
  "suspicious_patterns": [
    "urgent.{0,20}action.{0,20}required",
    "click.{0,20}here.{0,20}immediately"
  ],
  "ai_score": 0.751,
  "pattern_score": 0.9
}
```

### 🌐 Web Interface

The React frontend provides a comprehensive dashboard:

1. **Email Scanner**: Paste email content for instant AI analysis
2. **Scan History**: View past scans with filtering and sorting
3. **Analytics**: Detailed statistics and trend analysis
4. **API Key Management**: Create and manage API access keys

#### Sample Email Testing
The web interface includes built-in sample emails for testing:
- **Phishing Example**: Demonstrates urgent action/account suspension tactics
- **Spam Example**: Shows typical promotional spam patterns
- **Legitimate Example**: Normal business communication

### 🔌 API Integration

#### Authentication
All API endpoints require authentication via Bearer token:

```bash
# Get your API key from the web interface or development output
curl -H "Authorization: Bearer YOUR_API_KEY" http://localhost:8000/scan
```

#### Scan Email Endpoint
```bash
curl -X POST "http://localhost:8000/scan" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email_text": "URGENT: Verify your account immediately!",
    "user_id": "optional-user-identifier"
  }'
```

#### Get Scan History
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  "http://localhost:8000/history?limit=10&offset=0"
```

#### Create API Key
```bash
curl -X POST "http://localhost:8000/create-key" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Application",
    "description": "API key for my email scanner integration"
  }'
```

## 🧪 Testing

### Run the Test Suite

```bash
# Install test dependencies
pip install pytest pytest-asyncio pytest-cov

# Run all tests
python -m pytest tests/ -v

# Run with coverage
python -m pytest tests/ --cov=ai --cov=backend --cov-report=html

# Run specific test categories
python -m pytest tests/test_email_guard.py::TestEmailGuardian -v
python -m pytest tests/test_email_guard.py::TestSecurity -v
```

### Test Categories

- **Core AI Tests**: Email classification accuracy and preprocessing
- **API Tests**: Endpoint functionality and error handling
- **Security Tests**: Input validation and malicious content handling
- **Performance Tests**: Response time and memory efficiency
- **Integration Tests**: End-to-end workflow testing

## 🔒 Security Considerations

> **⚠️ Important**: This tool processes potentially malicious content. Please review our [Security Documentation](security_notes.md) before deployment.

### Key Security Features

- **Input Sanitization**: All email content is sanitized and validated
- **No Content Storage**: Original emails are never permanently stored
- **Rate Limiting**: 100 requests per hour per IP address
- **API Authentication**: Token-based access control
- **Audit Logging**: All actions logged for security monitoring

### Security Best Practices

1. **API Key Security**: Store API keys securely, rotate regularly
2. **Network Security**: Use HTTPS in production environments
3. **Input Validation**: Validate all user inputs before processing
4. **Regular Updates**: Keep dependencies updated for security patches
5. **Monitoring**: Monitor for unusual usage patterns or attacks

## 📊 Performance & Scalability

### System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| RAM | 4GB | 8GB+ |
| CPU | 2 cores | 4+ cores |
| Storage | 2GB | 5GB+ |
| Python | 3.8+ | 3.9+ |

### Performance Metrics

- **Average Classification Time**: 150-500ms (CPU-only)
- **Throughput**: 100+ emails/hour (with rate limiting)
- **Memory Usage**: ~2GB with model loaded
- **Startup Time**: 10-30 seconds (model loading)

### Optimization Tips

```python
# Pre-load models for better performance
export TRANSFORMERS_CACHE=/path/to/cache
export HF_HOME=/path/to/huggingface/cache

# Use environment variables for configuration
export EMAIL_GUARD_MODEL=martin-ha/toxic-comment-model
export EMAIL_GUARD_MAX_LENGTH=512
```

## 🛠️ Development

### Project Structure

```
email_guard/
├── ai/                     # Core AI functionality
│   ├── email_guard.py      # Main classification engine
│   └── models/             # Model cache (auto-created)
├── backend/                # FastAPI backend
│   ├── app.py              # Main API server
│   └── email_guardian.db   # SQLite database (auto-created)
├── frontend/               # React web interface
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.js          # Main React app
│   │   └── index.css       # Tailwind styles
│   ├── public/             # Static assets
│   └── package.json        # NPM dependencies
├── tests/                  # Test suite
│   └── test_email_guard.py # Comprehensive tests
├── docs/                   # Documentation
│   ├── README.md           # This file
│   ├── security_notes.md   # Security documentation
│   └── architecture.png    # System architecture diagram
├── requirements.txt        # Python dependencies
└── reflection.md           # Project reflection
```

### Adding New Features

1. **New AI Models**: Modify `EmailGuardian.__init__()` to support additional models
2. **New Patterns**: Add regex patterns to `suspicious_patterns` list
3. **New Endpoints**: Add routes to `backend/app.py` with proper authentication
4. **New Components**: Create React components in `frontend/src/components/`

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Run tests (`python -m pytest tests/ -v`)
4. Commit changes (`git commit -m 'Add amazing feature'`)
5. Push to branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📚 Educational Value

This project is designed as an educational tool for cybersecurity students, covering:

### Learning Objectives

- **AI/ML Applications**: Practical use of transformers for text classification
- **Web Security**: Input validation, authentication, and secure API design
- **Full-Stack Development**: Integration of AI, backend, and frontend components
- **Cybersecurity Practices**: Threat modeling, security testing, and incident response
- **Cloud Computing**: Deployment considerations and scalability

### Academic Applications

- **Course Projects**: Suitable for capstone or advanced coursework
- **Research**: Base for investigating phishing detection techniques
- **Demonstration**: Live demo of AI-powered security tools
- **Assessment**: Practical evaluation of cybersecurity concepts

## 🚀 Deployment Options

### 🐳 Docker Deployment (Recommended)
The project is fully containerized for easy deployment:

```bash
# Quick start with Docker
git clone https://github.com/ASMAEMISBAH22/email_guard.git
cd email_guard
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

**Docker Benefits:**
- ✅ **One-command deployment** - No complex setup required
- ✅ **Consistent environment** - Works the same everywhere
- ✅ **Full-stack solution** - Backend + Frontend + AI models
- ✅ **Production ready** - Optimized for performance
- ✅ **Easy scaling** - Simple horizontal scaling
- ✅ **Development mode** - Hot reload for development

See [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md) for detailed Docker instructions.

### ☁️ Vercel Deployment (Serverless)
For serverless deployment on Vercel:

```bash
# Deploy to Vercel (Free Tier - No Credit Card Required)
# 1. Go to vercel.com and sign up with GitHub
# 2. Import your repository: ASMAEMISBAH22/email_guard
# 3. Vercel will automatically detect and deploy your FastAPI backend
# 4. Your API will be live at: https://your-project-name.vercel.app
```

**Vercel Free Tier Benefits:**
- ✅ **100GB-hours/month** serverless functions
- ✅ **100GB/month** bandwidth
- ✅ **Unlimited custom domains** with free SSL
- ✅ **Automatic deployments** from GitHub
- ✅ **Global CDN** for fast worldwide access
- ✅ **No credit card required**

See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for detailed deployment instructions.

### 🖥️ Local Development
```bash
# Backend only
cd backend && python app.py

# Full stack
cd backend && python app.py &
cd frontend && npm start
```

### 🏗️ Traditional Server (Alternative)
```bash
# Backend with Gunicorn
cd backend
gunicorn app:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000

# Frontend build
cd frontend
npm run build
# Serve build/ with nginx or Apache
```

## 🎓 Learning Resources

### Recommended Reading
- [OWASP Email Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Email_Security_Cheat_Sheet.html)
- [HuggingFace Transformers Documentation](https://huggingface.co/docs/transformers/)
- [FastAPI Security Documentation](https://fastapi.tiangolo.com/tutorial/security/)
- [React Security Best Practices](https://snyk.io/blog/10-react-security-best-practices/)

### Hands-On Exercises
1. **Model Comparison**: Test different HuggingFace models for accuracy
2. **Pattern Enhancement**: Add new phishing/spam detection patterns
3. **Performance Optimization**: Implement caching and model quantization
4. **Security Testing**: Conduct penetration testing on the API
5. **Feature Extension**: Add email attachment analysis

## 🤝 Support & Community

### Getting Help
- **Documentation**: Check this README and docs/ directory
- **Issues**: Report bugs or request features via GitHub Issues
- **Discussions**: Join conversations in GitHub Discussions
- **Security**: Report security issues via private advisory

### Acknowledgments
- **HuggingFace**: For providing accessible AI models
- **FastAPI**: For the excellent Python web framework
- **React**: For the modern frontend framework
- **Educational Community**: For inspiration and feedback

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📈 Project Metrics

- **Lines of Code**: ~3,000 (Python + JavaScript)
- **Test Coverage**: 85%+ across core functionality
- **Documentation**: Comprehensive with examples
- **Security Score**: A+ (static analysis tools)

---

**Built with ❤️ for cybersecurity education and practical application.**

*Last updated: December 2024* 