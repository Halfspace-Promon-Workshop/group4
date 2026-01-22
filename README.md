# Promon Mobile Threat Translator

AI-powered mobile app security analysis tool that generates customer-ready security briefs from app descriptions or APK files.

## Features

- **Two Input Modes:**
  - Paste app store descriptions for quick analysis
  - Upload APK files for metadata-based analysis

- **4-Stage AI Analysis Chain:**
  1. Infer app capabilities from description
  2. Identify realistic attack vectors
  3. Map threats to Promon protections
  4. Generate professional security brief

- **Dual AI Provider Support:**
  - OpenAI (GPT-4)
  - Anthropic (Claude)

- **Professional Output:**
  - Customer-ready 1-2 page security briefs
  - Markdown formatted for easy sharing
  - Risk-prioritized threat analysis

## Project Structure

```
group4/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entry point
│   │   ├── config.py            # Settings & environment
│   │   ├── routers/
│   │   │   └── analyze.py       # API endpoints
│   │   ├── services/
│   │   │   ├── ai_service.py    # OpenAI/Anthropic abstraction
│   │   │   ├── apk_parser.py    # APK metadata extraction
│   │   │   └── prompt_chain.py  # 4-stage orchestration
│   │   ├── prompts/             # AI prompt templates
│   │   └── models/
│   │       └── schemas.py       # Pydantic models
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/          # React components
│   │   ├── api/                 # API client
│   │   └── styles/              # CSS
│   └── package.json
└── README.md
```

## Quick Start

### Prerequisites

- Python 3.10+
- Node.js 18+
- OpenAI API key and/or Anthropic API key

### Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cat > .env << EOF
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your-key-here
# Or for Anthropic:
# AI_PROVIDER=anthropic
# ANTHROPIC_API_KEY=sk-ant-your-key-here
EOF

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

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/analyze/description` | POST | Analyze app from description |
| `/api/analyze/apk` | POST | Analyze app from APK file |
| `/api/health` | GET | Health check |

### Example: Analyze from Description

```bash
curl -X POST http://localhost:8000/api/analyze/description \
  -H "Content-Type: application/json" \
  -d '{
    "description": "SecureBank Mobile lets you manage accounts, transfer money, pay bills, and deposit checks. Features fingerprint login and real-time fraud alerts.",
    "app_name": "SecureBank Mobile",
    "platform": "Android"
  }'
```

### Example: Analyze APK

```bash
curl -X POST http://localhost:8000/api/analyze/apk \
  -F "file=@/path/to/app.apk" \
  -F "app_name=MyApp"
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `AI_PROVIDER` | `openai` | AI provider (`openai` or `anthropic`) |
| `OPENAI_API_KEY` | - | OpenAI API key |
| `ANTHROPIC_API_KEY` | - | Anthropic API key |
| `OPENAI_MODEL` | `gpt-4` | OpenAI model to use |
| `ANTHROPIC_MODEL` | `claude-3-sonnet-20240229` | Anthropic model to use |
| `API_HOST` | `0.0.0.0` | API server host |
| `API_PORT` | `8000` | API server port |

## How It Works

### Prompt Chain

The analysis uses a 4-stage prompt chain:

1. **Capabilities Inference** - Analyzes the app description to identify security-relevant features (authentication, data handling, payments, etc.)

2. **Attack Surface Analysis** - Maps capabilities to realistic attack vectors with likelihood and business impact assessments

3. **Promon Mapping** - Connects each threat to specific Promon protection capabilities

4. **Brief Generation** - Synthesizes all findings into a professional, customer-ready security brief

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
- OpenAI / Anthropic - AI providers
- Androguard - APK parsing

**Frontend:**
- React 18 - UI framework
- Vite - Build tool
- Axios - HTTP client
- react-markdown - Brief rendering

## Development

### Running Tests

```bash
# Backend
cd backend
pytest

# Frontend
cd frontend
npm test
```

### Code Style

```bash
# Backend
black app/
ruff check app/

# Frontend
npm run lint
```

## License

Proprietary - Promon AS
