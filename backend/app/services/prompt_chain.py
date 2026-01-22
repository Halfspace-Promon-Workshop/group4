"""Prompt chain orchestration service.

Executes the 4-stage prompt chain for threat analysis.
"""

import json
from typing import Callable, Optional

from app.services.ai_service import get_ai_service, AIService
from app.prompts.prompt1_capabilities import get_capabilities_prompt
from app.prompts.prompt2_attack_surface import get_attack_surface_prompt
from app.prompts.prompt3_promon_mapping import get_promon_mapping_prompt
from app.prompts.prompt4_security_brief import get_security_brief_prompt
from app.models.schemas import (
    CapabilitiesResponse,
    AttackSurfaceResponse,
    PromonMappingResponse,
    SecurityBriefResponse,
    AnalysisStage,
)


class PromptChain:
    """Orchestrates the 4-stage threat analysis prompt chain."""
    
    STAGES = [
        {"stage": 1, "name": "Inferring Capabilities"},
        {"stage": 2, "name": "Analyzing Attack Surface"},
        {"stage": 3, "name": "Mapping Promon Protections"},
        {"stage": 4, "name": "Generating Security Brief"},
    ]
    
    def __init__(self, ai_service: Optional[AIService] = None, provider: Optional[str] = None):
        """Initialize the prompt chain.
        
        Args:
            ai_service: Optional AI service instance. If not provided, creates one.
            provider: Optional provider name (openai/anthropic/google). If not provided, uses default.
        """
        if ai_service:
            self.ai_service = ai_service
        elif provider:
            self.ai_service = AIService(provider=provider)
        else:
            self.ai_service = get_ai_service()
        self.stages: list[AnalysisStage] = []
        self._progress_callback: Optional[Callable[[AnalysisStage], None]] = None
    
    def set_progress_callback(self, callback: Callable[[AnalysisStage], None]):
        """Set a callback function for progress updates."""
        self._progress_callback = callback
    
    def _update_stage(self, stage_num: int, status: str, result: Optional[dict] = None):
        """Update a stage's status and notify the callback."""
        stage_info = self.STAGES[stage_num - 1]
        stage = AnalysisStage(
            stage=stage_info["stage"],
            name=stage_info["name"],
            status=status,
            result=result
        )
        
        # Update or add the stage
        if stage_num <= len(self.stages):
            self.stages[stage_num - 1] = stage
        else:
            self.stages.append(stage)
        
        if self._progress_callback:
            self._progress_callback(stage)
    
    async def analyze(
        self, 
        app_name: str, 
        platform: str, 
        description: str,
        target_audience: str = "sales"
    ) -> SecurityBriefResponse:
        """Run the full 4-stage analysis chain.
        
        Args:
            app_name: Name of the application
            platform: Target platform (Android/iOS)
            description: App description text
            target_audience: Target audience for the report (technical/executive/sales/compliance)
            
        Returns:
            SecurityBriefResponse with all analysis results
        """
        self.target_audience = target_audience
        # Initialize stages
        self.stages = []
        for stage_info in self.STAGES:
            self.stages.append(AnalysisStage(
                stage=stage_info["stage"],
                name=stage_info["name"],
                status="pending"
            ))
        
        # Stage 1: Infer Capabilities
        self._update_stage(1, "in_progress")
        try:
            capabilities = await self._run_stage_1(app_name, platform, description)
            self._update_stage(1, "completed", capabilities.model_dump())
        except Exception as e:
            self._update_stage(1, "error", {"error": str(e)})
            raise
        
        # Stage 2: Analyze Attack Surface
        self._update_stage(2, "in_progress")
        try:
            attack_surface = await self._run_stage_2(app_name, platform, capabilities)
            self._update_stage(2, "completed", attack_surface.model_dump())
        except Exception as e:
            self._update_stage(2, "error", {"error": str(e)})
            raise
        
        # Stage 3: Map to Promon Protections
        self._update_stage(3, "in_progress")
        try:
            promon_mapping = await self._run_stage_3(app_name, platform, attack_surface)
            self._update_stage(3, "completed", promon_mapping.model_dump())
        except Exception as e:
            self._update_stage(3, "error", {"error": str(e)})
            raise
        
        # Stage 4: Generate Security Brief
        self._update_stage(4, "in_progress")
        try:
            brief_markdown = await self._run_stage_4(
                app_name, platform, capabilities, attack_surface, promon_mapping, self.target_audience
            )
            self._update_stage(4, "completed", {"brief": brief_markdown})
        except Exception as e:
            self._update_stage(4, "error", {"error": str(e)})
            raise
        
        return SecurityBriefResponse(
            app_name=app_name,
            platform=platform,
            brief_markdown=brief_markdown,
            capabilities=capabilities,
            attack_surface=attack_surface,
            promon_mapping=promon_mapping,
            analysis_stages=self.stages
        )
    
    async def _run_stage_1(
        self, 
        app_name: str, 
        platform: str, 
        description: str
    ) -> CapabilitiesResponse:
        """Stage 1: Infer app capabilities from description."""
        system_prompt, user_prompt = get_capabilities_prompt(app_name, platform, description)
        result = await self.ai_service.generate_json(system_prompt, user_prompt)
        return CapabilitiesResponse(**result)
    
    async def _run_stage_2(
        self, 
        app_name: str, 
        platform: str, 
        capabilities: CapabilitiesResponse
    ) -> AttackSurfaceResponse:
        """Stage 2: Analyze attack surface based on capabilities."""
        capabilities_json = json.dumps(
            [c.model_dump() for c in capabilities.capabilities], 
            indent=2
        )
        
        system_prompt, user_prompt = get_attack_surface_prompt(
            app_name, platform, capabilities_json, capabilities.summary
        )
        result = await self.ai_service.generate_json(system_prompt, user_prompt)
        return AttackSurfaceResponse(**result)
    
    async def _run_stage_3(
        self, 
        app_name: str, 
        platform: str, 
        attack_surface: AttackSurfaceResponse
    ) -> PromonMappingResponse:
        """Stage 3: Map attacks to Promon protections."""
        attack_vectors_json = json.dumps(
            [av.model_dump() for av in attack_surface.attack_vectors], 
            indent=2
        )
        
        system_prompt, user_prompt = get_promon_mapping_prompt(
            app_name, platform, attack_vectors_json
        )
        result = await self.ai_service.generate_json(system_prompt, user_prompt)
        return PromonMappingResponse(**result)
    
    async def _run_stage_4(
        self,
        app_name: str,
        platform: str,
        capabilities: CapabilitiesResponse,
        attack_surface: AttackSurfaceResponse,
        promon_mapping: PromonMappingResponse,
        target_audience: str = "sales"
    ) -> str:
        """Stage 4: Generate the final security brief."""
        system_prompt, user_prompt = get_security_brief_prompt(
            app_name=app_name,
            platform=platform,
            capabilities_json=json.dumps(capabilities.model_dump(), indent=2),
            attack_surface_json=json.dumps(attack_surface.model_dump(), indent=2),
            promon_mapping_json=json.dumps(promon_mapping.model_dump(), indent=2),
            target_audience=target_audience
        )
        
        # This stage returns markdown, not JSON
        return await self.ai_service.generate(system_prompt, user_prompt, temperature=0.7)
