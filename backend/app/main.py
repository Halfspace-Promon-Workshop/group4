"""FastAPI application entry point for Promon Mobile Threat Translator."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import analyze, search

app = FastAPI(
    title="Promon Mobile Threat Translator",
    description="AI-powered mobile app security analysis tool",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(analyze.router, prefix="/api")
app.include_router(search.router, prefix="/api")


@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "ai_provider": settings.ai_provider,
    }


@app.get("/api/providers")
async def get_providers():
    """Get available AI providers based on configured API keys."""
    providers = settings.get_available_providers()
    default = settings.get_default_provider()
    return {
        "providers": providers,
        "default": default
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=settings.api_host, port=settings.api_port)
