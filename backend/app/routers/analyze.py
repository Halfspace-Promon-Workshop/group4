"""API routes for threat analysis."""

from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import Optional

from app.models.schemas import (
    DescriptionAnalysisRequest,
    SecurityBriefResponse,
    APKMetadata,
)
from app.services.prompt_chain import PromptChain
from app.services.apk_parser import APKParser
from app.config import settings

router = APIRouter(tags=["analyze"])


@router.post("/analyze/description", response_model=SecurityBriefResponse)
async def analyze_description(request: DescriptionAnalysisRequest):
    """Analyze an app based on its description.
    
    Takes an app description (e.g., from the Play Store or App Store) and
    runs the 4-stage threat analysis to generate a security brief.
    """
    try:
        # Use provided app name or generate a default
        app_name = request.app_name or "Mobile Application"
        platform = request.platform or "Android"
        target_audience = request.target_audience or "sales"
        
        # Run the prompt chain
        chain = PromptChain()
        result = await chain.analyze(
            app_name=app_name,
            platform=platform,
            description=request.description,
            target_audience=target_audience.value if hasattr(target_audience, 'value') else target_audience
        )
        
        return result
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )


@router.post("/analyze/apk", response_model=SecurityBriefResponse)
async def analyze_apk(
    file: UploadFile = File(..., description="APK file to analyze"),
    app_name: Optional[str] = Form(None, description="Override app name"),
    target_audience: Optional[str] = Form("sales", description="Target audience for the report")
):
    """Analyze an Android app from its APK file.
    
    Extracts metadata from the APK (permissions, components, etc.) and
    uses it to run the threat analysis.
    """
    # Validate file
    if not file.filename or not file.filename.lower().endswith('.apk'):
        raise HTTPException(
            status_code=400,
            detail="File must be an APK file (.apk extension)"
        )
    
    # Check file size
    content = await file.read()
    if len(content) > settings.max_upload_size:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size is {settings.max_upload_size // (1024*1024)}MB"
        )
    
    try:
        # Parse APK metadata
        metadata = await APKParser.parse_apk(content, file.filename)
        
        # Convert metadata to description
        description = APKParser.metadata_to_description(metadata)
        
        # Use provided name or extracted name
        final_app_name = app_name or metadata.app_name
        
        # Run the prompt chain
        chain = PromptChain()
        result = await chain.analyze(
            app_name=final_app_name,
            platform="Android",
            description=description,
            target_audience=target_audience or "sales"
        )
        
        return result
        
    except ImportError as e:
        # Only catch androguard import errors
        if "androguard" in str(e).lower():
            raise HTTPException(
                status_code=500,
                detail="APK parsing not available. Please install androguard: pip install androguard"
            )
        raise HTTPException(
            status_code=500,
            detail=f"Import error: {str(e)}"
        )
    except Exception as e:
        import traceback
        print(f"APK analysis error: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail=f"APK analysis failed: {str(e)}"
        )


@router.get("/analyze/apk/metadata", response_model=APKMetadata)
async def get_apk_metadata(
    file: UploadFile = File(..., description="APK file to analyze")
):
    """Extract metadata from an APK without running full analysis.
    
    Useful for previewing what will be analyzed before running the full chain.
    """
    if not file.filename or not file.filename.lower().endswith('.apk'):
        raise HTTPException(
            status_code=400,
            detail="File must be an APK file (.apk extension)"
        )
    
    content = await file.read()
    
    try:
        metadata = await APKParser.parse_apk(content, file.filename)
        return metadata
    except ImportError:
        raise HTTPException(
            status_code=500,
            detail="APK parsing not available. Please install androguard."
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to parse APK: {str(e)}"
        )
