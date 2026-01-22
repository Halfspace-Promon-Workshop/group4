"""Pydantic models for request/response schemas."""

from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum


class RiskLevel(str, Enum):
    """Risk level enumeration."""
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    CRITICAL = "Critical"


class TargetAudience(str, Enum):
    """Target audience for the security brief."""
    TECHNICAL = "technical"  # Developers, Security Engineers, CTOs
    EXECUTIVE = "executive"  # C-suite, VPs, Board members
    SALES = "sales"  # Sales Engineers, Account Executives
    COMPLIANCE = "compliance"  # Compliance officers, Risk managers


class DescriptionAnalysisRequest(BaseModel):
    """Request model for description-based analysis."""
    description: str = Field(..., min_length=50, description="App description text")
    app_name: Optional[str] = Field(None, description="Optional app name")
    platform: Optional[str] = Field("Android", description="Target platform")
    target_audience: Optional[TargetAudience] = Field(TargetAudience.SALES, description="Target audience for the report")
    ai_provider: Optional[str] = Field(None, description="AI provider to use (openai/anthropic/google)")


class InferredCapability(BaseModel):
    """A single inferred app capability."""
    capability: str
    description: str
    security_relevance: str
    confidence: str


class CapabilitiesResponse(BaseModel):
    """Response from capabilities inference."""
    app_name: str
    platform: str
    capabilities: list[InferredCapability]
    summary: str


class AttackVector(BaseModel):
    """A single attack vector."""
    name: str
    description: str
    how_it_works: str
    business_impact: str
    likelihood: RiskLevel
    affected_capabilities: list[str]


class AttackSurfaceResponse(BaseModel):
    """Response from attack surface analysis."""
    attack_vectors: list[AttackVector]
    overall_risk_level: RiskLevel
    summary: str


class PromonProtection(BaseModel):
    """Mapping of attack to Promon protection."""
    attack_name: str
    promon_products: list[str] = Field(default_factory=list)  # Updated to list of products
    promon_solution: Optional[str] = None  # Keep for backwards compatibility
    how_it_mitigates: str
    value_statement: str


class ProductRecommendation(BaseModel):
    """A single product recommendation."""
    product: str
    reason: str
    threats_addressed: list[str] = Field(default_factory=list)


class RecommendedProducts(BaseModel):
    """Categorized product recommendations."""
    essential: list[ProductRecommendation] = Field(default_factory=list)
    recommended: list[ProductRecommendation] = Field(default_factory=list)
    optional: list[ProductRecommendation] = Field(default_factory=list)


class PromonMappingResponse(BaseModel):
    """Response from Promon mapping."""
    protections: list[PromonProtection]
    recommended_products: Optional[RecommendedProducts] = None
    coverage_summary: str


class AnalysisStage(BaseModel):
    """Status of a single analysis stage."""
    stage: int
    name: str
    status: str  # "pending", "in_progress", "completed", "error"
    result: Optional[dict] = None


class SecurityBriefResponse(BaseModel):
    """Final security brief response."""
    app_name: str
    platform: str
    brief_markdown: str
    capabilities: CapabilitiesResponse
    attack_surface: AttackSurfaceResponse
    promon_mapping: PromonMappingResponse
    analysis_stages: list[AnalysisStage]


class APKMetadata(BaseModel):
    """Extracted APK metadata."""
    app_name: str
    package_name: str
    version_name: Optional[str] = None
    version_code: Optional[int] = None
    min_sdk: Optional[int] = None
    target_sdk: Optional[int] = None
    permissions: list[str] = []
    activities: list[str] = []
    services: list[str] = []
    receivers: list[str] = []
    providers: list[str] = []
