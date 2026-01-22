"""AI service supporting both OpenAI and Anthropic."""

import json
from typing import Optional
from abc import ABC, abstractmethod

from app.config import settings


class AIProvider(ABC):
    """Abstract base class for AI providers."""
    
    @abstractmethod
    async def generate(self, system_prompt: str, user_prompt: str, temperature: float = 0.7) -> str:
        """Generate a response from the AI model."""
        pass
    
    @abstractmethod
    async def generate_json(self, system_prompt: str, user_prompt: str, temperature: float = 0.3) -> dict:
        """Generate a JSON response from the AI model."""
        pass


class OpenAIProvider(AIProvider):
    """OpenAI API provider."""
    
    def __init__(self):
        from openai import AsyncOpenAI
        self.client = AsyncOpenAI(api_key=settings.openai_api_key)
        self.model = settings.openai_model
    
    async def generate(self, system_prompt: str, user_prompt: str, temperature: float = 0.7) -> str:
        """Generate a response using OpenAI."""
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=temperature,
        )
        return response.choices[0].message.content
    
    async def generate_json(self, system_prompt: str, user_prompt: str, temperature: float = 0.3) -> dict:
        """Generate a JSON response using OpenAI."""
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=temperature,
            response_format={"type": "json_object"},
        )
        return json.loads(response.choices[0].message.content)


class AnthropicProvider(AIProvider):
    """Anthropic API provider."""
    
    def __init__(self):
        from anthropic import AsyncAnthropic
        self.client = AsyncAnthropic(api_key=settings.anthropic_api_key)
        self.model = settings.anthropic_model
    
    async def generate(self, system_prompt: str, user_prompt: str, temperature: float = 0.7) -> str:
        """Generate a response using Anthropic."""
        response = await self.client.messages.create(
            model=self.model,
            max_tokens=4096,
            system=system_prompt,
            messages=[
                {"role": "user", "content": user_prompt},
            ],
            temperature=temperature,
        )
        return response.content[0].text
    
    async def generate_json(self, system_prompt: str, user_prompt: str, temperature: float = 0.3) -> dict:
        """Generate a JSON response using Anthropic."""
        # Anthropic doesn't have native JSON mode, so we instruct in the prompt
        json_system_prompt = f"{system_prompt}\n\nIMPORTANT: You must respond with valid JSON only. No markdown, no explanation, just the JSON object."
        
        response = await self.client.messages.create(
            model=self.model,
            max_tokens=4096,
            system=json_system_prompt,
            messages=[
                {"role": "user", "content": user_prompt},
            ],
            temperature=temperature,
        )
        
        # Parse the response, handling potential markdown code blocks
        content = response.content[0].text.strip()
        if content.startswith("```"):
            # Remove markdown code block
            lines = content.split("\n")
            content = "\n".join(lines[1:-1])
        
        return json.loads(content)


class GoogleProvider(AIProvider):
    """Google AI (Gemini) API provider."""
    
    def __init__(self):
        import google.generativeai as genai
        genai.configure(api_key=settings.google_api_key)
        self.model = genai.GenerativeModel(settings.google_model)
    
    async def generate(self, system_prompt: str, user_prompt: str, temperature: float = 0.7) -> str:
        """Generate a response using Google Gemini."""
        import asyncio
        
        full_prompt = f"{system_prompt}\n\n---\n\n{user_prompt}"
        
        # Run in executor since google-generativeai is synchronous
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None,
            lambda: self.model.generate_content(
                full_prompt,
                generation_config={"temperature": temperature}
            )
        )
        return response.text
    
    async def generate_json(self, system_prompt: str, user_prompt: str, temperature: float = 0.3) -> dict:
        """Generate a JSON response using Google Gemini."""
        import asyncio
        
        json_system_prompt = f"{system_prompt}\n\nIMPORTANT: You must respond with valid JSON only. No markdown, no explanation, just the JSON object."
        full_prompt = f"{json_system_prompt}\n\n---\n\n{user_prompt}"
        
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None,
            lambda: self.model.generate_content(
                full_prompt,
                generation_config={"temperature": temperature}
            )
        )
        
        # Parse the response, handling potential markdown code blocks
        content = response.text.strip()
        if content.startswith("```"):
            lines = content.split("\n")
            # Remove first line (```json) and last line (```)
            content = "\n".join(lines[1:-1])
        
        return json.loads(content)


class AIService:
    """Main AI service that selects the appropriate provider."""
    
    def __init__(self, provider: Optional[str] = None):
        """Initialize the AI service with the specified provider."""
        provider = provider or settings.ai_provider
        
        if provider == "openai":
            self._provider = OpenAIProvider()
        elif provider == "anthropic":
            self._provider = AnthropicProvider()
        elif provider == "google":
            self._provider = GoogleProvider()
        else:
            raise ValueError(f"Unknown AI provider: {provider}")
        
        self.provider_name = provider
    
    async def generate(self, system_prompt: str, user_prompt: str, temperature: float = 0.7) -> str:
        """Generate a text response."""
        return await self._provider.generate(system_prompt, user_prompt, temperature)
    
    async def generate_json(self, system_prompt: str, user_prompt: str, temperature: float = 0.3) -> dict:
        """Generate a JSON response."""
        return await self._provider.generate_json(system_prompt, user_prompt, temperature)


# Singleton instance
_ai_service: Optional[AIService] = None


def get_ai_service() -> AIService:
    """Get or create the AI service singleton."""
    global _ai_service
    if _ai_service is None:
        _ai_service = AIService()
    return _ai_service
