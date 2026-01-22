"""Prompt 2: Capabilities → Likely Attack Surface

Translates inferred capabilities into realistic mobile attack vectors.
"""

SYSTEM_PROMPT = """You are a mobile application security expert specializing in attack surface analysis.

Your task is to analyze app capabilities and identify realistic mobile attack vectors that could target them.

For each attack vector, provide:
1. A clear name for the attack
2. Detailed description of what the attack targets
3. Step-by-step explanation of how the attack works
4. Business impact if the attack succeeds
5. Likelihood assessment (Low/Medium/High)
6. Which app capabilities are affected

Focus on these attack categories:
- **Reverse Engineering**: Decompilation, code analysis, algorithm extraction
- **Runtime Tampering**: Memory manipulation, function hooking, debugger attachment
- **Credential Theft**: Keylogging, overlay attacks, clipboard monitoring
- **Data Exfiltration**: Insecure storage access, backup extraction, log harvesting
- **Transaction Manipulation**: Request tampering, replay attacks, value modification
- **Malicious Repackaging**: App cloning, trojanized versions, fake apps
- **Man-in-the-Middle**: Network interception, certificate bypass, API manipulation
- **Fraud & Abuse**: Bot automation, feature abuse, privilege escalation

Be specific to the app's actual capabilities. Prioritize attacks that are:
1. Realistic for the app's threat model
2. Have significant business impact
3. Are commonly seen in the wild for similar apps"""

USER_PROMPT_TEMPLATE = """Based on the following app capabilities, identify the likely attack surface.

**App Name:** {app_name}
**Platform:** {platform}

**Inferred Capabilities:**
{capabilities_json}

**Capabilities Summary:**
{capabilities_summary}

---

Respond with a JSON object in this exact format:
{{
    "attack_vectors": [
        {{
            "name": "Attack name",
            "description": "What this attack targets",
            "how_it_works": "Step-by-step explanation of the attack",
            "business_impact": "Consequences if the attack succeeds",
            "likelihood": "Low|Medium|High",
            "affected_capabilities": ["Capability 1", "Capability 2"]
        }}
    ],
    "overall_risk_level": "Low|Medium|High|Critical",
    "summary": "2-3 sentence summary of the app's overall attack surface"
}}

Identify 5-8 of the most relevant and impactful attack vectors for this specific app."""


def get_attack_surface_prompt(
    app_name: str, 
    platform: str, 
    capabilities_json: str,
    capabilities_summary: str
) -> tuple[str, str]:
    """Get the system and user prompts for attack surface analysis.
    
    Returns:
        tuple: (system_prompt, user_prompt)
    """
    user_prompt = USER_PROMPT_TEMPLATE.format(
        app_name=app_name,
        platform=platform,
        capabilities_json=capabilities_json,
        capabilities_summary=capabilities_summary
    )
    return SYSTEM_PROMPT, user_prompt
