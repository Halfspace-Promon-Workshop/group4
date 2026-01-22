"""Prompts package."""

from .prompt1_capabilities import get_capabilities_prompt
from .prompt2_attack_surface import get_attack_surface_prompt
from .prompt3_promon_mapping import get_promon_mapping_prompt
from .prompt4_security_brief import get_security_brief_prompt

__all__ = [
    "get_capabilities_prompt",
    "get_attack_surface_prompt",
    "get_promon_mapping_prompt",
    "get_security_brief_prompt",
]
