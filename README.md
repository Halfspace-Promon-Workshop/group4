# Promon Mobile Threat Translator

AI-powered mobile app security analysis tool that generates customer-ready security briefs from app descriptions, APK files, or Play Store searches.

## Features

- **Three Input Modes:**
  - 📝 Paste app store descriptions for quick analysis
  - 📦 Upload APK files for metadata-based analysis
  - 🔍 Search Play Store by app name, package ID, or URL

- **Multiple AI Provider Support:**
  - OpenAI (GPT-4, GPT-4o, etc.)
  - Anthropic Claude (Claude 3.5 Sonnet, etc.)
  - Google Gemini (Gemini 1.5 Flash, etc.)
  - Dropdown selector to choose provider at runtime

- **4-Stage AI Analysis Chain:**
  1. Infer app capabilities from description
  2. Identify realistic attack vectors
  3. Map threats to Promon protections
  4. Generate professional security brief

- **Audience-Tailored Reports:**
  - Technical (developers, security engineers)
  - Executive (C-suite, VPs)
  - Sales (account executives, SEs)
  - Compliance (risk managers, auditors)

- **Professional Output:**
  - Customer-ready 1-2 page security briefs
  - Financial impact analysis with ROI calculations
  - Promon product recommendations
  - Risk-prioritized threat analysis

- **Additional Features:**
  - Analysis history (stored locally)
  - Promon Insight dashboard mockup
  - Threat correlation visualization

## Project Structure

```
group4/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entry point
│   │   ├── config.py            # Settings & environment
│   │   ├── routers/
│   │   │   ├── analyze.py       # Analysis endpoints
│   │   │   └── search.py        # Play Store search endpoints
│   │   ├── services/
│   │   │   ├── ai_service.py    # OpenAI/Anthropic/Google abstraction
│   │   │   ├── apk_parser.py    # APK metadata extraction
│   │   │   ├── playstore_service.py  # Play Store search
│   │   │   └── prompt_chain.py  # 4-stage orchestration
│   │   ├── prompts/             # AI prompt templates
│   │   └── models/
│   │       └── schemas.py       # Pydantic models
│   ├── requirements.txt
│   └── .env                     # Environment config (not in git)
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/          # React components
│   │   ├── api/                 # API client
│   │   ├── utils/               # Utilities
│   │   └── styles/              # CSS
│   └── package.json
└── README.md
```

## Quick Start

### Prerequisites

- Python 3.10+
- Node.js 18+
- At least one AI provider API key (OpenAI, Anthropic, or Google)

### Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file (see example below)
cp .env.example .env
# Edit .env with your API keys

# Start the server
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Environment Configuration

Create a `.env` file in the `backend/` directory:

### Example `.env` file

```env
# ===========================================
# Promon Mobile Threat Translator Configuration
# ===========================================

# Default AI Provider (openai, anthropic, or google)
# This is used when no provider is selected in the UI
AI_PROVIDER=openai

# -------------------------------------------
# OpenAI Configuration
# -------------------------------------------
OPENAI_API_KEY=sk-proj-your-openai-api-key-here
OPENAI_MODEL=gpt-4o

# Available OpenAI models:
# - gpt-4o (recommended)
# - gpt-4o-mini (faster, cheaper)
# - gpt-4-turbo
# - gpt-4

# -------------------------------------------
# Anthropic Claude Configuration
# -------------------------------------------
ANTHROPIC_API_KEY=sk-ant-api03-your-anthropic-api-key-here
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022

# Available Anthropic models:
# - claude-3-5-sonnet-20241022 (recommended)
# - claude-3-opus-20240229
# - claude-3-sonnet-20240229
# - claude-3-haiku-20240307

# -------------------------------------------
# Google Gemini Configuration
# -------------------------------------------
GOOGLE_API_KEY=AIzaSy-your-google-api-key-here
GOOGLE_MODEL=gemini-1.5-flash

# Available Google models:
# - gemini-1.5-flash (recommended)
# - gemini-1.5-pro
# - gemini-pro

# -------------------------------------------
# Server Configuration (optional)
# -------------------------------------------
# API_HOST=0.0.0.0
# API_PORT=8000
```

### Minimal Configuration (Single Provider)

If you only have one API key, you only need:

```env
# OpenAI only
AI_PROVIDER=openai
OPENAI_API_KEY=sk-proj-your-key-here
OPENAI_MODEL=gpt-4o
```

```env
# Anthropic only
AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
```

```env
# Google only
AI_PROVIDER=google
GOOGLE_API_KEY=AIzaSy-your-key-here
GOOGLE_MODEL=gemini-1.5-flash
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/analyze/description` | POST | Analyze app from description |
| `/api/analyze/apk` | POST | Analyze app from APK file |
| `/api/search/playstore` | GET | Search Play Store for apps |
| `/api/search/playstore/{app_id}` | GET | Get app details by package ID |
| `/api/providers` | GET | Get available AI providers |
| `/api/health` | GET | Health check |

### Example: Analyze from Description

```bash
curl -X POST http://localhost:8000/api/analyze/description \
  -H "Content-Type: application/json" \
  -d '{
    "description": "SecureBank Mobile lets you manage accounts, transfer money, pay bills, and deposit checks. Features fingerprint login and real-time fraud alerts.",
    "app_name": "SecureBank Mobile",
    "platform": "Android",
    "target_audience": "executive",
    "ai_provider": "openai"
  }'
```

### Example: Search Play Store

```bash
# Search by name
curl "http://localhost:8000/api/search/playstore?q=Netflix&limit=10"

# Get app by package ID
curl "http://localhost:8000/api/search/playstore/com.netflix.mediaclient"
```

### Example: Analyze APK

```bash
curl -X POST http://localhost:8000/api/analyze/apk \
  -F "file=@/path/to/app.apk" \
  -F "app_name=MyApp" \
  -F "target_audience=technical" \
  -F "ai_provider=anthropic"
```

## How It Works

### Prompt Chain

The analysis uses a 4-stage prompt chain:

1. **Capabilities Inference** - Analyzes the app description to identify security-relevant features (authentication, data handling, payments, etc.)

2. **Attack Surface Analysis** - Maps capabilities to realistic attack vectors with likelihood and business impact assessments

3. **Promon Mapping** - Connects each threat to specific Promon protection capabilities with product recommendations

4. **Brief Generation** - Synthesizes all findings into a professional, customer-ready security brief with financial impact analysis

### Play Store Search

The Play Store search feature allows you to:
- Search by app name (e.g., "Netflix")
- Search by package ID (e.g., "com.netflix.mediaclient")
- Paste a Play Store URL directly

The app's description is automatically fetched and used for analysis.

### APK Analysis

For APK uploads, the tool extracts:
- App name and package ID
- Permissions requested
- Activities, services, receivers
- SDK version targets

This metadata is converted to a structured description and fed through the same prompt chain.

## Tech Stack

**Backend:**
- FastAPI - API framework
- Pydantic - Data validation
- OpenAI / Anthropic / Google - AI providers
- Androguard - APK parsing
- google-play-scraper - Play Store search

**Frontend:**
- React 18 - UI framework
- Vite - Build tool
- React Router - Navigation
- Axios - HTTP client
- react-markdown - Brief rendering

## Development

### Running the Backend

```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```

### Running the Frontend

```bash
cd frontend
npm run dev
```

### Code Style

```bash
# Backend
cd backend
black app/
ruff check app/

# Frontend
cd frontend
npm run lint
```

## License

Proprietary - Promon AS
