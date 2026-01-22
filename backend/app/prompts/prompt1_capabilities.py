"""Prompt 1: App Description → Inferred Capabilities

Analyzes the provided app description to infer core functional capabilities
with security relevance.
"""

SYSTEM_PROMPT = """You are a mobile application security analyst specializing in understanding app functionality from descriptions.

Your task is to analyze mobile app descriptions and infer the app's core capabilities, focusing on aspects that have security implications.

For each capability you identify, assess:
1. What the capability does
2. Why it's security-relevant (what sensitive data/operations it involves)
3. Your confidence level in the inference (High/Medium/Low)

Focus on these capability categories:
- Authentication & Identity (login flows, biometrics, session management)
- Sensitive Data Handling (PII, financial data, health data, credentials)
- Payment & Transactions (in-app purchases, money transfers, payment processing)
- Network & API Communication (backend connections, third-party integrations)
- Device Features (camera, location, contacts, storage access)
- Offline Capabilities (local storage, cached data, offline transactions)
- Cryptography Usage (encryption, secure storage, key management)

Be thorough but only infer capabilities that are clearly supported by the description.
All inferences should be probabilistic and based strictly on the provided description."""

USER_PROMPT_TEMPLATE = """Analyze the following mobile application and infer its capabilities.

**App Name:** {app_name}
**Platform:** {platform}

**App Description:**
{description}

---

Respond with a JSON object in this exact format:
{{
    "app_name": "{app_name}",
    "platform": "{platform}",
    "capabilities": [
        {{
            "capability": "Name of the capability",
            "description": "What this capability does in the app",
            "security_relevance": "Why this capability is security-relevant",
            "confidence": "High|Medium|Low"
        }}
    ],
    "summary": "A 2-3 sentence summary of the app's overall security-relevant functionality"
}}

Identify all capabilities with security relevance. Be specific to this app."""


def get_capabilities_prompt(app_name: str, platform: str, description: str) -> tuple[str, str]:
    """Get the system and user prompts for capabilities inference.
    
    Returns:
        tuple: (system_prompt, user_prompt)
    """
    user_prompt = USER_PROMPT_TEMPLATE.format(
        app_name=app_name,
        platform=platform,
        description=description
    )
    return SYSTEM_PROMPT, user_prompt
