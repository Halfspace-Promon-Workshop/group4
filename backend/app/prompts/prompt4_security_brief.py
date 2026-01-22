"""Prompt 4: SE Copilot → Customer Security Brief

Synthesizes all findings into a meeting-ready 1-2 page security brief with product recommendations,
tailored to the target audience (technical, executive, sales, compliance).
"""

AUDIENCE_GUIDELINES = {
    "technical": """
## Audience: Technical (Developers, Security Engineers, CTOs)

**Tone & Focus:**
- Deep technical detail on attack vectors and mitigations
- Include specific attack techniques (e.g., Frida hooks, Magisk modules, binary patching)
- Reference OWASP Mobile Top 10, MASVS, and CVEs where relevant
- Explain HOW protections work at a technical level
- Include code-level examples of vulnerabilities where appropriate
- Focus on implementation details and integration considerations

**Financial Section:**
- Include ROI calculations for security investment
- Compare cost of implementing protection vs. cost of a breach
- Reference industry breach cost statistics (IBM Cost of a Data Breach Report)
""",
    
    "executive": """
## Audience: Executive (C-Suite, VPs, Board Members)

**Tone & Focus:**
- Lead with business impact and strategic risk
- Minimize technical jargon - translate to business language
- Focus on brand reputation, customer trust, and competitive advantage
- Emphasize regulatory compliance and liability exposure
- Include peer/competitor context where possible
- Keep it concise - executives have limited time

**Financial Section:**
- CRITICAL: Lead with financial impact numbers
- Include annual estimated loss from security vulnerabilities
- Show potential savings from implementing Promon protection
- Reference high-profile breaches in similar industries with actual costs
- Calculate potential revenue protection and fraud prevention value
- Include TCO (Total Cost of Ownership) considerations
""",
    
    "sales": """
## Audience: Sales (Sales Engineers, Account Executives)

**Tone & Focus:**
- Balance technical credibility with business value
- Create clear value propositions for each product
- Include objection-handling talking points
- Focus on differentiation from competitors
- Make it easy to present in customer meetings
- Include compelling statistics and quotes

**Financial Section:**
- Include ROI and payback period estimates
- Show cost of inaction vs. cost of protection
- Reference industry breach statistics and trends
- Quantify the value of prevented attacks
""",
    
    "compliance": """
## Audience: Compliance (Compliance Officers, Risk Managers, Auditors)

**Tone & Focus:**
- Map threats to specific regulatory requirements (PCI-DSS, GDPR, PSD2, HIPAA, etc.)
- Reference compliance frameworks and standards
- Focus on audit trail and evidence capabilities
- Emphasize documentation and reporting features
- Include risk scoring and assessment language
- Reference industry best practices and certifications

**Financial Section:**
- Focus on regulatory fine avoidance
- Include compliance violation cost statistics
- Reference actual enforcement actions and penalties
- Calculate risk reduction in financial terms
"""
}

FINANCIAL_IMPACT_DATA = """
## Mobile Security Financial Impact Data (Use these statistics)

### CRITICAL: Financial Calculation Method
**ALWAYS calculate financial impact as a percentage of company revenue/value:**
- Use 1-5% of estimated annual revenue as the risk exposure range
- For well-known companies, research their approximate revenue:
  - Netflix: ~$33B revenue → risk exposure: $330M - $1.65B (use $500M-$800M)
  - Spotify: ~$14B revenue → risk exposure: $140M - $700M (use $200M-$400M)
  - Instagram/Facebook: ~$120B revenue → risk exposure: $1.2B - $6B (use $2B-$3B)
  - Discord: ~$500M revenue → risk exposure: $5M - $25M (use $10M-$15M)
  - Uber: ~$37B revenue → risk exposure: $370M - $1.85B (use $500M-$900M)
  - Banking apps (large): ~$10B+ revenue → risk exposure: $100M - $500M
  - Banking apps (medium): ~$1B revenue → risk exposure: $10M - $50M
- For unknown companies, estimate based on app category:
  - Enterprise/B2B apps: $5M - $50M annual risk
  - Consumer fintech: $10M - $100M annual risk
  - E-commerce: $5M - $30M annual risk
  - Social/Entertainment: $2M - $20M annual risk
  - Healthcare: $10M - $50M annual risk
  - Gaming: $1M - $10M annual risk
  - Utility apps: $500K - $5M annual risk

**Be consistent: Same company = Same approximate financial figures**

### Industry Breach Costs (IBM Cost of a Data Breach Report 2024)
- Average cost of a data breach: $4.88 million globally
- Average cost in financial services: $6.08 million
- Average cost in healthcare: $10.93 million
- Cost per stolen record: $165

### Mobile-Specific Threats
- Mobile fraud losses globally: $100+ billion annually
- Average mobile app attack costs: $1.2M - $4.2M per incident
- Account takeover fraud: $11 billion annually
- Credential stuffing attacks: $5 billion in losses yearly

### Cost Categories to Include (as % of total risk)
1. **Direct Financial Loss** (30-40%): Fraud, theft, ransomware payments
2. **Regulatory Fines** (15-25%): GDPR (up to €20M or 4% revenue), PCI-DSS ($5K-$100K/month)
3. **Remediation Costs** (10-15%): Incident response, forensics, system rebuilding
4. **Reputation Damage** (20-30%): Customer churn (avg 3.4% after breach), brand value loss
5. **Operational Disruption** (5-10%): Downtime costs, employee productivity loss
6. **Legal Costs** (5-10%): Lawsuits, settlements, legal fees

### ROI Calculation Framework
- Average app protection investment: $50K - $200K annually
- Typical protection reduces risk by: 70-85%
- Typical ROI: 10x - 100x investment (based on company size)
- Payback period: Often < 3 months after implementation

### Promon Value Propositions (Financial)
- Prevent reverse engineering → Protect competitive advantage worth millions
- Stop credential theft → Prevent account takeover fraud ($500-$5000 per account)
- Block tampering → Maintain transaction integrity
- API protection → Prevent automated attacks costing $100K+ per campaign
"""

SYSTEM_PROMPT_TEMPLATE = """You are a senior sales engineer at Promon creating customer-ready security briefs.

Your task is to synthesize threat analysis findings into a professional, compelling security brief that can be used directly in customer meetings.

{audience_guidelines}

## Financial Impact Requirements (MANDATORY)
You MUST include a dedicated "Financial Impact" section that:
1. Estimates the annual financial risk from identified vulnerabilities
2. Calculates potential losses if attacks succeed
3. Shows the ROI of implementing Promon protection
4. References real industry statistics and breach costs

{financial_data}

## Structure
1. Executive Summary - Hook with key insights and financial risk
2. Application Profile - What the app does and handles
3. Key Mobile Attack Scenarios - Prioritized threats
4. **Financial Impact Analysis** - CRITICAL SECTION
5. Business Impact - Broader consequences
6. Recommended Promon Solution - Products with clear rationale
7. ROI & Savings Projection
8. Suggested Next Steps

## Promon Product Quick Reference
- **Shield for Mobile**: Core app shielding (tampering, rooting, injection, debugging)
- **Verify**: API attestation and backend security
- **Code Protect**: Code obfuscation for IP protection
- **Data Protect**: Encrypted storage for sensitive data
- **Insight for App Visibility**: Protection visibility for stakeholders
- **Insight for App Security**: Threat telemetry for security/fraud teams
- **Shield for SDKs**: SDK protection for SDK providers
- **Integrator**: Streamlined protection integration

## Formatting
- Use Markdown formatting
- Keep to 1-2 pages when printed
- Use tables for clarity
- Include risk levels (🔴 High, 🟡 Medium, 🟢 Low)
- Use 💰 or $ symbols when discussing financial impact
- Bold key financial figures"""


USER_PROMPT_TEMPLATE = """Create a customer-ready security brief for the following app.

**App Name:** {app_name}
**Platform:** {platform}
**Target Audience:** {target_audience}

---

## Analysis Results

### Inferred Capabilities
{capabilities_json}

### Attack Surface Analysis
{attack_surface_json}

### Promon Protection Mapping
{promon_mapping_json}

---

Generate a professional security brief in Markdown format tailored for **{target_audience}** audience.

# Mobile Security Brief: {app_name}

## Executive Summary
(2-3 sentences summarizing security posture, top risks, AND estimated annual financial exposure)

## Application Profile
(Brief overview of what the app does and sensitive data/operations it handles)

## Key Mobile Attack Scenarios

| Threat | Risk | Business Impact | Est. Annual Loss |
|--------|------|-----------------|------------------|
(Top 4-5 threats with estimated financial impact)

(For each top threat, explain the attack scenario appropriate for {target_audience})

## 💰 Financial Impact Analysis

### Estimated Annual Risk Exposure
(Calculate the total estimated annual financial risk from all identified vulnerabilities)

| Risk Category | Estimated Annual Cost | Likelihood | Weighted Risk |
|--------------|----------------------|------------|---------------|
(Break down by category: fraud, data breach, compliance fines, reputation damage, etc.)

**Total Estimated Annual Risk: $X,XXX,XXX**

### Cost of Inaction
(What happens if they don't act - use industry statistics)

### Industry Benchmarks
(Reference similar companies/industries and their breach costs)

## Business Impact
(What's at stake: financial, reputational, regulatory, operational - tailored for {target_audience})

## Recommended Promon Solution

### Essential Products
| Product | Why It's Needed | Threats Addressed | Est. Risk Reduction |
|---------|-----------------|-------------------|---------------------|
(Core products with financial value)

### Recommended Additions
| Product | Value Add | Threats Addressed | Est. Risk Reduction |
|---------|-----------|-------------------|---------------------|
(Strongly recommended based on the app's profile)

### Solution Summary
(2-3 paragraphs on comprehensive protection - tailored for {target_audience})

## 📊 ROI & Savings Projection

| Metric | Value |
|--------|-------|
| Estimated Annual Risk Without Protection | $X,XXX,XXX |
| Estimated Risk Reduction with Promon | XX% |
| Protected Value | $X,XXX,XXX |
| Typical Promon Investment | $XX,XXX - $XXX,XXX |
| **ROI** | **X:1** |
| **Payback Period** | **X months** |

## Recommended Next Steps
1. (Actionable recommendation 1)
2. (Actionable recommendation 2)
3. (Actionable recommendation 3)

---

**Important:** 
- Make the brief specific to this app
- TAILOR language and depth for {target_audience} audience
- Include concrete financial figures - do not use vague language
- Show clear ROI for Promon investment
- Keep to approximately 1-2 pages when printed"""


def get_security_brief_prompt(
    app_name: str,
    platform: str,
    capabilities_json: str,
    attack_surface_json: str,
    promon_mapping_json: str,
    target_audience: str = "sales"
) -> tuple[str, str]:
    """Get the system and user prompts for security brief generation.
    
    Args:
        app_name: Name of the application
        platform: Target platform
        capabilities_json: JSON string of capabilities
        attack_surface_json: JSON string of attack surface analysis
        promon_mapping_json: JSON string of Promon mapping
        target_audience: Target audience (technical/executive/sales/compliance)
    
    Returns:
        tuple: (system_prompt, user_prompt)
    """
    # Get audience-specific guidelines
    audience_guidelines = AUDIENCE_GUIDELINES.get(
        target_audience.lower(), 
        AUDIENCE_GUIDELINES["sales"]
    )
    
    # Build system prompt with audience guidelines and financial data
    system_prompt = SYSTEM_PROMPT_TEMPLATE.format(
        audience_guidelines=audience_guidelines,
        financial_data=FINANCIAL_IMPACT_DATA
    )
    
    # Build user prompt
    user_prompt = USER_PROMPT_TEMPLATE.format(
        app_name=app_name,
        platform=platform,
        target_audience=target_audience.title(),
        capabilities_json=capabilities_json,
        attack_surface_json=attack_surface_json,
        promon_mapping_json=promon_mapping_json
    )
    
    return system_prompt, user_prompt
