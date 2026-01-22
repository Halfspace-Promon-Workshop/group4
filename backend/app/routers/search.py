"""Search router for Play Store app discovery."""

from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query

from app.services.playstore_service import (
    PlayStoreService,
    PlayStoreAppSummary,
    PlayStoreAppDetails
)

router = APIRouter(tags=["search"])


@router.get("/search/playstore", response_model=List[PlayStoreAppSummary])
async def search_playstore(
    q: str = Query(..., min_length=1, description="Search query (app name or package ID)"),
    limit: int = Query(10, ge=1, le=30, description="Maximum number of results"),
    lang: str = Query("en", description="Language code"),
    country: str = Query("us", description="Country code")
):
    """
    Search for apps on the Google Play Store.
    
    Returns a list of matching apps with basic information including
    app ID, title, developer, icon, rating, and price.
    """
    try:
        results = await PlayStoreService.search_apps(
            query=q,
            limit=limit,
            lang=lang,
            country=country
        )
        return results
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to search Play Store: {str(e)}"
        )


@router.get("/search/playstore/{app_id}", response_model=PlayStoreAppDetails)
async def get_playstore_app(
    app_id: str,
    lang: str = Query("en", description="Language code"),
    country: str = Query("us", description="Country code")
):
    """
    Get detailed information about a specific app from Google Play Store.
    
    Returns full app details including description, category, version,
    install count, and more.
    """
    try:
        details = await PlayStoreService.get_app_details(
            app_id=app_id,
            lang=lang,
            country=country
        )
        return details
    except Exception as e:
        # Check if it's a "not found" type error
        error_msg = str(e).lower()
        if "not found" in error_msg or "404" in error_msg:
            raise HTTPException(
                status_code=404,
                detail=f"App '{app_id}' not found on Play Store"
            )
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch app details: {str(e)}"
        )
