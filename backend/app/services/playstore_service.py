"""Play Store service for searching and fetching app details."""

from typing import List, Optional
from pydantic import BaseModel
import asyncio
import re
from concurrent.futures import ThreadPoolExecutor
from urllib.parse import urlparse, parse_qs

# Thread pool for running blocking operations
_executor = ThreadPoolExecutor(max_workers=3)

# Regex pattern to extract package ID from Play Store URLs
PLAYSTORE_URL_PATTERN = re.compile(
    r'play\.google\.com/store/apps/details\?.*id=([a-zA-Z0-9._]+)'
)


class PlayStoreAppSummary(BaseModel):
    """Summary of an app from Play Store search results."""
    app_id: str = ""  # Package ID
    title: str = ""
    developer: str = ""
    icon: str = ""
    score: Optional[float] = None
    price: Optional[float] = None
    free: bool = True
    summary: Optional[str] = None


class PlayStoreAppDetails(BaseModel):
    """Detailed information about an app from Play Store."""
    app_id: str
    title: str
    developer: str
    icon: str
    score: Optional[float] = None
    ratings: Optional[int] = None
    reviews: Optional[int] = None
    price: Optional[float] = None
    free: bool = True
    description: str
    summary: Optional[str] = None
    installs: Optional[str] = None
    min_installs: Optional[int] = None
    genre: Optional[str] = None
    category: Optional[str] = None
    content_rating: Optional[str] = None
    released: Optional[str] = None
    updated: Optional[str] = None
    version: Optional[str] = None
    size: Optional[str] = None
    android_version: Optional[str] = None
    url: str


class PlayStoreService:
    """Service for interacting with Google Play Store."""
    
    @staticmethod
    def extract_package_id_from_url(url: str) -> Optional[str]:
        """
        Extract the package ID from a Play Store URL.
        
        Examples:
            https://play.google.com/store/apps/details?id=com.netflix.mediaclient&hl=en
            -> com.netflix.mediaclient
        """
        match = PLAYSTORE_URL_PATTERN.search(url)
        if match:
            return match.group(1)
        
        # Try parsing as URL query params
        try:
            parsed = urlparse(url)
            if 'play.google.com' in parsed.netloc:
                params = parse_qs(parsed.query)
                if 'id' in params:
                    return params['id'][0]
        except Exception:
            pass
        
        return None
    
    @staticmethod
    def is_playstore_url(query: str) -> bool:
        """Check if the query is a Play Store URL."""
        return 'play.google.com' in query and 'id=' in query
    
    @staticmethod
    def _search_sync(query: str, n_results: int = 10, lang: str = "en", country: str = "us") -> List[dict]:
        """Synchronous search function to run in thread pool."""
        from google_play_scraper import search
        return search(query, n_hits=n_results, lang=lang, country=country)
    
    @staticmethod
    def _get_details_sync(app_id: str, lang: str = "en", country: str = "us") -> dict:
        """Synchronous details function to run in thread pool."""
        from google_play_scraper import app
        return app(app_id, lang=lang, country=country)
    
    @staticmethod
    def _looks_like_package_id(query: str) -> bool:
        """Check if the query looks like a package ID (e.g., com.discord)."""
        # Package IDs typically have format: com.company.app or similar
        parts = query.split('.')
        return len(parts) >= 2 and all(p.isalnum() or p == '_' for p in parts)
    
    @classmethod
    async def search_apps(
        cls,
        query: str,
        limit: int = 10,
        lang: str = "en",
        country: str = "us"
    ) -> List[PlayStoreAppSummary]:
        """
        Search for apps on the Play Store.
        
        Args:
            query: Search query (app name, package ID, or Play Store URL)
            limit: Maximum number of results to return
            lang: Language code for results
            country: Country code for results
            
        Returns:
            List of PlayStoreAppSummary objects
        """
        # Check if query is a Play Store URL
        if cls.is_playstore_url(query):
            package_id = cls.extract_package_id_from_url(query)
            if package_id:
                # Fetch the app directly and return as single result
                try:
                    details = await cls.get_app_details(package_id, lang, country)
                    return [PlayStoreAppSummary(
                        app_id=details.app_id,
                        title=details.title,
                        developer=details.developer,
                        icon=details.icon,
                        score=details.score,
                        price=details.price,
                        free=details.free,
                        summary=details.summary
                    )]
                except Exception:
                    pass  # Fall through to regular search
        
        # Check if query looks like a package ID
        if cls._looks_like_package_id(query):
            try:
                details = await cls.get_app_details(query, lang, country)
                return [PlayStoreAppSummary(
                    app_id=details.app_id,
                    title=details.title,
                    developer=details.developer,
                    icon=details.icon,
                    score=details.score,
                    price=details.price,
                    free=details.free,
                    summary=details.summary
                )]
            except Exception:
                pass  # Fall through to regular search
        
        loop = asyncio.get_event_loop()
        apps = []
        
        # For simple queries (single word, no spaces), try direct package lookup first
        # This helps find apps like "Discord" -> com.discord
        query_clean = query.strip().lower()
        if ' ' not in query_clean and len(query_clean) >= 3:
            package_patterns = [
                f"com.{query_clean}",
                f"com.{query_clean}.android",
            ]
            for pattern in package_patterns:
                try:
                    details = await cls.get_app_details(pattern, lang, country)
                    if details.app_id and details.title:
                        apps.append(PlayStoreAppSummary(
                            app_id=details.app_id,
                            title=details.title,
                            developer=details.developer,
                            icon=details.icon,
                            score=details.score,
                            price=details.price,
                            free=details.free,
                            summary=details.summary
                        ))
                        break  # Found the main app, stop trying patterns
                except Exception:
                    continue
        
        # Try regular search
        results = await loop.run_in_executor(
            _executor,
            lambda: cls._search_sync(query, limit * 2, lang, country)  # Request more to account for filtering
        )
        
        # Track app IDs we've already added to avoid duplicates
        seen_app_ids = {app.app_id for app in apps}
        
        for item in results:
            if len(apps) >= limit:
                break
            # Skip items without a valid app_id
            app_id = item.get("appId")
            if not app_id or app_id in seen_app_ids:
                continue
            
            seen_app_ids.add(app_id)
            apps.append(PlayStoreAppSummary(
                app_id=app_id,
                title=item.get("title") or "",
                developer=item.get("developer") or "",
                icon=item.get("icon") or "",
                score=item.get("score"),
                price=item.get("price"),
                free=item.get("free", True),
                summary=item.get("summary")
            ))
        
        # If still no results, try searching with " app" suffix as last resort
        if not apps and len(query) > 1:
            try:
                results = await loop.run_in_executor(
                    _executor,
                    lambda: cls._search_sync(f"{query} app", limit * 2, lang, country)
                )
                for item in results:
                    if len(apps) >= limit:
                        break
                    app_id = item.get("appId")
                    if not app_id or app_id in seen_app_ids:
                        continue
                    seen_app_ids.add(app_id)
                    apps.append(PlayStoreAppSummary(
                        app_id=app_id,
                        title=item.get("title") or "",
                        developer=item.get("developer") or "",
                        icon=item.get("icon") or "",
                        score=item.get("score"),
                        price=item.get("price"),
                        free=item.get("free", True),
                        summary=item.get("summary")
                    ))
            except Exception:
                pass  # Ignore fallback search failures
        
        return apps
    
    @classmethod
    async def get_app_details(
        cls,
        app_id: str,
        lang: str = "en",
        country: str = "us"
    ) -> PlayStoreAppDetails:
        """
        Get detailed information about an app.
        
        Args:
            app_id: Package ID of the app (e.g., "com.instagram.android") or Play Store URL
            lang: Language code
            country: Country code
            
        Returns:
            PlayStoreAppDetails object with full app information
        """
        # Check if app_id is actually a URL
        if cls.is_playstore_url(app_id):
            extracted_id = cls.extract_package_id_from_url(app_id)
            if extracted_id:
                app_id = extracted_id
        
        loop = asyncio.get_event_loop()
        
        # Run the blocking call in a thread pool
        details = await loop.run_in_executor(
            _executor,
            lambda: cls._get_details_sync(app_id, lang, country)
        )
        
        return PlayStoreAppDetails(
            app_id=details.get("appId") or app_id,
            title=details.get("title") or "",
            developer=details.get("developer") or "",
            icon=details.get("icon") or "",
            score=details.get("score"),
            ratings=details.get("ratings"),
            reviews=details.get("reviews"),
            price=details.get("price"),
            free=details.get("free", True),
            description=details.get("description") or "",
            summary=details.get("summary"),
            installs=details.get("installs"),
            min_installs=details.get("minInstalls"),
            genre=details.get("genre"),
            category=details.get("genre"),  # genre is the category
            content_rating=details.get("contentRating"),
            released=details.get("released"),
            updated=str(details.get("updated")) if details.get("updated") else None,
            version=details.get("version"),
            size=details.get("size"),
            android_version=details.get("androidVersion"),
            url=details.get("url") or f"https://play.google.com/store/apps/details?id={app_id}"
        )
