# Competitor Research System — OmnifiCX
## Senior PM Reviewed | Version 3
## No-Code Composable Commerce Integration Platform
## US SMB Ecommerce | $1M–$50M | Hub & Spoke + OMS + PIM + WMS
## Claude Code Task Master File — Production Ready

---

## PRODUCT DEFINITION

OmnifiCX is a **no-code composable commerce integration platform** built on hub-and-spoke canonical data architecture. It connects ecommerce channels (Shopify, BigCommerce, Amazon, Etsy, TikTok Shop) to downstream systems (ERP, WMS, 3PL) through a unified sync layer with native modules for:

- **OMS:** Order aggregation, fulfillment routing, sync tracking, failure handling
- **PIM:** Product data syndication and consistency across channels
- **WMS:** Fulfillment location management, capacity, routing rules
- **Intelligence:** Real-time operational dashboards, failure detection, activity logs

**Architecture:** Hub and spoke. Canonical data model. All systems speak through the Hub. No point-to-point integrations. No developer required for standard operations.

**Target Segment:** US SMB ecommerce, $1M–$50M revenue, multi-channel (3+ sales channels), using 3+ backend systems that don't communicate natively.

**Buyer Pain:** Sync failures cause oversells, lost orders, and customer complaints. Connecting systems requires developers or $50K+ enterprise middleware. OmnifiCX eliminates this.

---

## VERIFIED COMPETITOR LIST (2026)

> IMPORTANT FOR CLAUDE CODE: TradeGecko/QuickBooks Commerce shut down in 2022 — do not research. Boomi and MuleSoft are enterprise $500K+ contracts — exclude from SMB analysis. Fabric OMS is enterprise-only — exclude.

### Category 1: eCommerce Integration / iPaaS (SMB-focused)

| Competitor | Notes |
|-----------|-------|
| Celigo | iPaaS with strong ecommerce+ERP connectors, mid-market focus |
| Pipe17 | Ecommerce order operations integration, Shopify-native |
| Make (Integromat) | No-code automation, growing ecommerce use cases |
| Zapier | SMB automation, shallow data model, high brand awareness |
| Jitterbit | Mid-market iPaaS, stronger than Boomi for SMB |
| Rutter | Unified commerce API layer, developer-first, growing fast 2024-2025 |
| Workato | Workflow automation + integration, moving down-market |
| Cart.com | Unified commerce operations platform |

### Category 2: Multi-Channel OMS (SMB-relevant)

| Competitor | Notes |
|-----------|-------|
| Linnworks | OMS + inventory + multichannel, strong UK/EU, growing US |
| Brightpearl (Sage) | Retail operations platform, OMS + light ERP, Sage-owned |
| Extensiv (Skubana) | Multi-warehouse OMS, 3PL focus |
| Ordoro | Multi-channel OMS, pure SMB focus |
| Veeqo | Multi-channel OMS — NOW FREE via Amazon acquisition (major disruption) |
| ShipStation | Order management + shipping labels, massive SMB install base |
| SKULabs | SMB-focused OMS + barcode scanning |
| Appath | Multichannel order management |
| Stord | Commerce cloud with OMS + fulfillment |

### Category 3: PIM (SMB-relevant)

| Competitor | Notes |
|-----------|-------|
| Plytix | SMB-focused PIM, strong Shopify integration |
| Channable | Feed management + PIM for SMBs, strong EU |
| Feedonomics (BB) | Product feed management, BigCommerce-owned |
| Akeneo | Enterprise PIM moving to mid-market — watch for SMB push |
| Katana | Manufacturing + product management + inventory |

### Category 4: Inventory + ERP Integration (SMB-relevant)

| Competitor | Notes |
|-----------|-------|
| Cin7 (Core + Omni) | Inventory + OMS + integrations, strong SMB install base |
| DEAR Systems (Cin7 Core) | SMB inventory management |
| Finale Inventory | SMB inventory management |
| Brightpearl | Appears in OMS and here — retail ERP + integrations |
| Acumatica | Cloud ERP with native ecommerce connectors |

### Special Watch: Platform-Native Threats (2026)

| Threat | Why Critical |
|--------|-------------|
| Shopify Flow + Shopify Markets | Shopify's own automation and multi-market expansion |
| Shopify Fulfillment Network (SFN) | Shopify building its own OMS/WMS layer |
| Amazon Multi-Channel Fulfillment (MCF) | Amazon offering fulfillment as a service + Veeqo free |
| TikTok Shop native integrations | New channel creating new integration demand |
| QuickBooks + Shopify native sync | Intuit building direct Shopify connector |

---

## TASK 1: COMPETITOR INVENTORY

**GOAL:** Build verified, structured inventory across all competitor categories

**RESEARCH METHOD FOR CLAUDE CODE:**
```
For each competitor, search in this exact order:
1. "[competitor name] pricing 2025" — get current pricing
2. "[competitor name] site:g2.com" — get G2 profile and review count
3. "[competitor name] shopify integration" — verify Shopify connection
4. "[competitor name] review reddit" — get unfiltered user opinions
5. "[competitor name] funding crunchbase" — get funding status
6. "[competitor name] job postings site:linkedin.com" — verify company health

DO NOT research: TradeGecko (shut down), Boomi (enterprise only), 
MuleSoft (enterprise only), Fabric OMS (enterprise only)

For Veeqo specifically: note it is now FREE via Amazon — this is a 
major competitive disruption that changes the pricing landscape significantly.
```

**Schema to populate for each competitor:**
```json
{
  "name": "",
  "category": "iPaaS/OMS/PIM/ERP-Integration/Platform-Native",
  "website": "",
  "founded": "",
  "funding_total": "",
  "funding_stage": "bootstrapped/seed/series-a/series-b/acquired/public",
  "parent_company": "",
  "employee_count_approx": "",
  "data_retrieved_date": "",
  "icp": {
    "revenue_band_stated": "",
    "revenue_band_actual": "",
    "primary_platforms": [],
    "erp_integrations": [],
    "wms_integrations": [],
    "primary_buyer": "founder/ops-manager/it-manager/ecommerce-manager"
  },
  "architecture": {
    "hub_and_spoke": "yes/no/partial",
    "point_to_point": "yes/no/partial",
    "canonical_data_model": "yes/no/unknown",
    "real_time_sync": "yes/no/batch-only",
    "bidirectional_sync": "yes/no/partial",
    "architecture_evidence_source": ""
  },
  "modules_native": {
    "oms": "native/integration/no",
    "pim": "native/integration/no",
    "wms": "native/integration/no",
    "inventory": "native/integration/no",
    "fulfillment_routing": "native/integration/no",
    "analytics_dashboard": "native/integration/no"
  },
  "no_code_reality": {
    "setup_persona_required": "developer/technical-ops/any-user",
    "avg_setup_time_from_reviews": "",
    "developer_required_for": [],
    "self_serve_capable": "yes/no/partial",
    "evidence_source": ""
  },
  "pricing": {
    "model": "per-order/flat-tier/gmv-pct/connector-based/free/module-based",
    "entry_price_usd": "",
    "mid_price_usd": "",
    "enterprise_price": "contact-sales/amount",
    "key_pricing_limit": "orders/connectors/gmv/users/skus",
    "free_tier": "yes/no",
    "free_trial_days": "",
    "implementation_fee": "",
    "pricing_retrieved_date": ""
  },
  "connector_count": "",
  "shopify_app_store": {
    "listed": "yes/no",
    "rating": "",
    "review_count": "",
    "ranking_category": ""
  },
  "smb_fit_score": "1-5",
  "key_differentiator": "",
  "known_weaknesses_from_reviews": [],
  "recent_significant_news": ""
}
```

**Save as:** `competitor_inventory.json` and `competitor_inventory.csv`

**Flag prominently:**
- Any competitor with data gaps (mark field as "data-unavailable")
- Any competitor that appears to have shut down or been acquired
- Any pricing that seems outdated (>6 months old estimate)

---

## TASK 2: ARCHITECTURE COMPARISON — EVIDENCE-BASED

**GOAL:** Compare architectural approaches using verifiable proxy signals, not marketing copy

**IMPORTANT:** Most SMB competitors do not publish architecture documentation. Use these proxy research methods instead:

**PROXY RESEARCH METHODS FOR CLAUDE CODE:**
```
Method 1 — Job Postings Analysis
Search: "[competitor name] software engineer job site:linkedin.com"
Look for: tech stack mentions (microservices, event-driven, Kafka, webhooks vs polling)
What it tells you: Real-time vs batch, architectural sophistication

Method 2 — Developer Documentation
Search: "[competitor name] API documentation" or "[competitor name] developer docs"
Look for: webhook support, API rate limits, data model documentation
What it tells you: Real-time capability, data model flexibility

Method 3 — Review Signal Mining
Search G2 reviews for: "sync delay", "real-time", "batch", "took hours to sync",
"instantly updated", "polling interval"
What it tells you: Actual sync behavior experienced by users

Method 4 — Changelog / Release Notes
Search: "[competitor name] changelog" or "[competitor name] release notes"
Look for: connector releases, sync improvements, data model changes
What it tells you: Velocity and direction of architecture evolution

Method 5 — Support Documentation
Search: "[competitor name] help center sync" or "[competitor name] troubleshoot sync"
Look for: sync frequency settings, conflict resolution docs
What it tells you: Whether real-time is real or marketing
```

**Architecture Dimensions to Score:**

```
A-01: Hub-and-spoke canonical model vs point-to-point
      Evidence: API docs, architecture diagrams if published, developer docs

A-02: True no-code configuration (use Task 7 criteria)
      Evidence: Review quotes, setup guides, onboarding docs

A-03: Real-time sync capability
      Evidence: Review quotes about sync speed, API webhook support

A-04: Bidirectional sync
      Evidence: Developer docs, review quotes about "pushing back to..."

A-05: Conflict resolution logic
      Evidence: Help docs, review quotes about "data conflicts" or "overwrote"

A-06: Native OMS (not integration to external OMS)
      Evidence: Product page, feature list, review context

A-07: Native PIM (not integration to external PIM)
      Evidence: Product page, feature list

A-08: Native fulfillment routing rules
      Evidence: Feature descriptions, review mentions of routing

A-09: Time to first working integration
      Evidence: Marketing claims + review reality check

A-10: Developer dependency for new connectors
      Evidence: Partner/connector pages, review mentions of "custom dev needed"

A-11: Error handling and retry without manual intervention
      Evidence: Review quotes about "had to manually fix", feature pages

A-12: Multi-channel order aggregation
      Evidence: Feature pages, review mentions of batch processing
```

**Scoring:**
```
For each dimension score:
- Capability: Yes / Partial / No / Unknown
- SMB accessible without developer: Yes / No / Partial
- Evidence quality: Strong (verified source) / Weak (marketing claim only) / Unknown
- Evidence source URL or description
```

**Save as:** `architecture_matrix.csv`
**Save summary as:** `architecture_differentiation.md`
Include: Top 5 OmnifiCX architectural advantages WITH evidence quality rating

---

## TASK 3: JOB-TO-BE-DONE MATRIX (2026 Updated)

**GOAL:** Map competitor coverage of SMB commerce operations jobs — including 2026 emerging jobs

**Complete Job List:**

```
CORE INTEGRATION JOBS:
J-01: Connect Shopify orders to ERP without developer
J-02: Route orders to correct fulfillment location automatically
J-03: Sync product catalog changes across all channels simultaneously
J-04: Prevent overselling when inventory changes in one channel
J-05: Aggregate orders from multiple channels into batches for warehouse
J-06: Track sync failures and retry without manual intervention
J-07: Configure fulfillment rules without writing code
J-08: Get real-time visibility into order status across all systems
J-09: Handle split shipments and multi-location fulfillment
J-10: Sync customer data across channels and CRM
J-11: Push product updates to Amazon, Shopify, BigCommerce simultaneously
J-12: Know immediately when ERP sync fails and why
J-13: Scale integrations when adding a new sales channel
J-14: Maintain data integrity when systems have conflicting records
J-15: Onboard a new fulfillment partner without IT involvement

2026 EMERGING JOBS:
J-16: Sync TikTok Shop orders with existing fulfillment infrastructure
J-17: Handle returns across multiple channels into one WMS consistently
J-18: Maintain consistent AI-generated product content across channels
J-19: Handle cross-state and international tax compliance automatically
J-20: Add new social commerce channel in days not months
J-21: Aggregate orders by rule (time-based or volume-based batching)
J-22: Get alerted when sync fails before customer notices
J-23: Audit exactly what changed in an order and when across systems
```

**Scoring per competitor × job:**
```
- Coverage: Full / Partial / No
- SMB_accessible: Yes / No (non-developer can do it)
- Time_to_value: <1 day / 1-7 days / 1-4 weeks / months
- Reliability_score: 1-5 (from review evidence)
- AI_assisted: Yes / No / Partial
- Evidence: quote or source
```

**For each job identify:**
- Best current solution and why
- Biggest gap across all solutions
- OmnifiCX opportunity score 1-10
- Rationale for score

**Save as:** `jtbd_matrix.csv`
**Save gaps as:** `integration_job_gaps.md` — top 8 underserved jobs with evidence

---

## TASK 4: PRICING MODEL ANALYSIS

**GOAL:** Map pricing landscape and find white space for OmnifiCX

**Pricing Models in This Category:**
```
- Per order processed ($X per 1000 orders — most common in OMS)
- Per connector ($X per connected app — common in iPaaS)
- Flat monthly tier with order volume limits
- GMV-based (% of gross merchandise — rare but exists)
- User/seat-based
- Module-based (base platform + OMS add-on + PIM add-on)
- Implementation fee + monthly recurring
- Free tier + paid connectors (freemium)
- Completely free (Veeqo — Amazon-subsidized — note this disruption)
```

**For each competitor extract:**
```
- Pricing model type
- Key limit variable (orders/month, connectors, GMV, users, SKUs)
- Entry tier: price + exact limits
- Mid tier: price + exact limits  
- Enterprise: price or "contact sales"
- Implementation/onboarding fee (stated or from reviews)
- Hidden costs from reviews (per-connector fees, support tier requirements,
  overage charges, API call limits)
- Stated time to go live
- Review reality of time to go live
```

**SMB Merchant Affordability Profiles:**
```
Profile A — Early SMB:
  Revenue: $2M/year
  Channels: Shopify + Amazon
  Backend: QuickBooks + 1 warehouse
  Orders: ~500/month
  Budget expectation: $150-400/month

Profile B — Growing SMB:
  Revenue: $10M/year
  Channels: Shopify + Amazon + BigCommerce
  Backend: NetSuite + 2 warehouses + 1 3PL
  Orders: ~3,000/month
  Budget expectation: $400-900/month

Profile C — Scaling SMB:
  Revenue: $30M/year
  Channels: Shopify + Amazon + BigCommerce + Wholesale
  Backend: NetSuite + ERP + 3 warehouses + multiple 3PLs
  Orders: ~8,000/month
  Budget expectation: $900-2,500/month
```

**For each profile:** Which competitors are accessible? Exact monthly cost? Hidden costs?

**Pricing Trap Analysis:**
Search reviews specifically for: "surprise charge", "expensive to scale",
"charged per connector", "implementation cost more than expected",
"had to upgrade plan for", "limited by order volume"

**Save as:** `pricing_analysis.csv`
**Save strategy as:** `pricing_recommendation.md`
Must include:
- Recommended OmnifiCX pricing model with rationale
- What pricing traps to explicitly avoid
- How to position vs Veeqo free tier (Amazon-backed — this is a real challenge)

---

## TASK 5: REVIEW MINING — SMB OPERATOR PAIN

**GOAL:** Extract real language, pain patterns, and switching triggers from SMB operators

**Source Priority (in order of signal quality for this category):**

```
TIER 1 SOURCES (highest signal):
1. Reddit — r/shopify, r/ecommerce, r/fulfillment, r/smallbusiness, r/entrepreneur
   Search queries:
   - "shopify inventory sync problems"
   - "order routing automation"
   - "multichannel inventory nightmare"
   - "ERP integration shopify"
   - "fulfillment location routing"
   - "[competitor name] problems"
   - "[competitor name] alternative"
   
2. Shopify Community Forums — community.shopify.com
   Search: competitor names + "integration" + "sync"

3. G2 Reviews — filtered to:
   Company size: 1-200 employees
   Rating: 1, 2, 3 stars FIRST (most honest)
   Category: Order Management, Inventory Management, iPaaS

TIER 2 SOURCES:
4. Capterra reviews (same filter approach as G2)
5. Trustpilot for competitor brand names
6. LinkedIn comments on competitor posts/announcements
7. ProductHunt launch threads for competitors

TIER 3 SOURCES (use if Tier 1-2 insufficient):
8. App store reviews (Shopify App Store, BigCommerce App Store)
9. YouTube comments on competitor demo videos
```

**For each review/mention extract:**
```json
{
  "source": "reddit/g2/capterra/shopify-community/linkedin",
  "competitor": "",
  "rating": "1-5 or n/a for reddit",
  "reviewer_company_size": "",
  "reviewer_role": "",
  "pain_category": "sync_failure/setup_complexity/cost_surprise/
                    reliability/support_quality/scaling_issues/
                    missing_feature/data_accuracy",
  "job_they_were_trying_to_do": "",
  "exact_quote": "",
  "switching_trigger": "",
  "what_they_switched_to": "",
  "date_of_review": ""
}
```

**Synthesis Requirements:**
```
1. Top 5 integration failure modes by frequency
2. Top 5 setup/onboarding friction points
3. Top 3 cost surprise patterns
4. Jobs SMBs say NO tool does well — exact quotes
5. Language map: exact phrases SMBs use for:
   - The pain OmnifiCX solves ("I spend hours every week...")
   - What they wish existed ("I just want something that...")
   - How they describe sync failures ("the orders didn't come through...")
6. Switching trigger patterns — what makes someone leave a tool
```

**Save raw as:** `review_data.csv`
**Save synthesis as:** `voc_synthesis.md`
This is the most important output for positioning and messaging — treat it as such.

---

## TASK 6: GTM & CHANNEL ANALYSIS

**GOAL:** Map competitive GTM landscape and identify channel white space

**For each competitor research:**

**A. App Store Presence:**
```
- Shopify App Store: listed? rating? review count? category ranking?
  Search: apps.shopify.com/[competitor-name]
- BigCommerce App Store: listed? rating?
- NetSuite SuiteApp Marketplace: listed?
- QuickBooks App Store: listed?
```

**B. Messaging Analysis (homepage only — fast signal):**
```
- H1 headline: exact text
- Who they say they're for: exact ICP language
- Job they lead with: what problem do they open with?
- Time-to-value claim: "go live in X" or "connect in minutes"
- Primary CTA: free trial / demo / contact sales / free forever
- Social proof type: customer logos / numbers / testimonials
```

**C. Partnership Ecosystem:**
```
Search: "[competitor name] partner program"
Search: "[competitor name] certified partners"
Search: "[competitor name] + NetSuite" / "+ QuickBooks" / "+ Xero"
Identify:
- Which ERPs they officially partner with (vs just integrate)
- Which 3PLs or fulfillment providers
- Which agencies implement them (SI partners)
- Exclusive or preferred status partnerships
```

**D. Content & SEO Signals:**
```
Search: "[competitor name] blog" — what topics do they publish?
Search: site:[competitor-domain] — content volume estimate
Note: primary content themes and whether they target SMB language
```

**Identify:**
- Channel white space: where no competitor is dominant
- Partnership gaps: ERPs or fulfillment providers not locked up
- Messaging white space: jobs or buyer personas no one addresses well
- App store opportunity: categories where reviews are low but demand is high

**Special analysis — Veeqo (free, Amazon-backed):**
This competitor requires separate treatment. Being free changes the competitive dynamic entirely.
Research: How do SMBs actually use Veeqo? What do they still need after Veeqo?
What does Veeqo not do that OmnifiCX does?

**Save as:** `gtm_analysis.csv`
**Save opportunity as:** `channel_whitespace.md`

---

## TASK 7: TRUE NO-CODE DEPTH ANALYSIS

**GOAL:** Verify which competitors are genuinely no-code for non-technical SMB operators

**Operationalized Definition of No-Code for This Research:**

```
SCORE 5 — TRUE NO-CODE:
An operations manager (not a developer, not an IT person) can independently:
✓ Connect a new ecommerce channel to their ERP in under 4 hours
✓ Map fields between systems using a visual UI — no JSON/YAML/code
✓ Configure order routing rules using dropdowns and conditions — no code
✓ Debug a sync failure and resolve it without a support ticket
✓ Onboard a new fulfillment location without IT involvement
✓ Add a new connector from a library without custom development

SCORE 3 — PARTIAL NO-CODE:
Above tasks are possible but require one or more of:
- Reading technical documentation before attempting
- Support chat/call assistance for initial configuration
- Developer for custom field mappings or transformations
- IT for any new connector not in the pre-built library

SCORE 1 — CODE REQUIRED:
Any standard operation requires:
- API keys and developer configuration
- Custom code for data transformations
- IT involvement for connectors
- Professional services for implementation
```

**Research Method:**
```
1. Search G2/Capterra reviews for these exact phrases:
   "had to hire a developer", "needed IT help", "setup was complex",
   "easy to set up", "no technical knowledge needed", "our ops team configured",
   "implementation took weeks", "went live in days"

2. Search for onboarding/setup documentation:
   "[competitor name] getting started guide"
   "[competitor name] how to connect shopify"
   Note: Is the guide for developers or for business users?

3. Search YouTube for:
   "[competitor name] setup tutorial"
   Note: Who is presenting — a developer or a business user?

4. Check for professional services pricing:
   If they charge $2,000+ implementation fees, it is NOT no-code

5. Check job postings:
   If they hire "implementation engineers" or "integration consultants"
   in high numbers, their "no-code" claim is marketing
```

**Save as:** `nocode_depth_analysis.csv`
**Save brief as:** `nocode_differentiation.md`
Include: Where each competitor's "no-code" claim falls apart + OmnifiCX's genuine advantage

---

## TASK 8: BATTLECARD GENERATION (Sales-Grade)

**GOAL:** Create sales-grade battlecards that actually help close deals — not marketing one-pagers

**Top 6 Competitors to Battlecard:**
```
1. Linnworks (most likely head-to-head for OMS)
2. Celigo (most likely head-to-head for iPaaS)
3. Brightpearl/Sage (head-to-head for OMS + ERP)
4. Pipe17 (head-to-head for Shopify-native integration)
5. Cin7 (head-to-head for inventory + ERP integration)
6. Veeqo (special case — free competitor, Amazon-backed)
```

**Battlecard Format (Sales-Grade):**
```
BATTLECARD: [Competitor Name]
Last Updated: [date]
Category: [iPaaS/OMS/PIM/ERP-Integration]

ONE-LINE WIN:
[Single sentence: why OmnifiCX wins this matchup]

WHY WE WIN (architecture-grounded):
• [Specific hub-and-spoke advantage with evidence]
• [Specific no-code advantage with evidence]
• [Specific module completeness advantage with evidence]

THEIR GENUINE STRENGTHS (be honest — sales reps need to know):
• [Real strength 1 — don't dismiss it]
• [Real strength 2]

THEIR REAL WEAKNESSES (backed by review quotes):
• "[Exact review quote]" — G2/source [date]
• "[Exact review quote]" — G2/source [date]
• [Third weakness with evidence]

HOW THEY'LL ATTACK US (what they'll say about OmnifiCX):
• [Attack 1 they'll use — e.g., "OmnifiCX is newer, less proven"]
• [Attack 2 — e.g., "We have more connectors"]
• [Attack 3]

OUR RESPONSES TO THEIR ATTACKS:
• [Response to attack 1]
• [Response to attack 2]
• [Response to attack 3]

DISCOVERY QUESTIONS (surface their weaknesses naturally):
• "[Question that makes prospect think about competitor's weakness]"
• "[Question 2]"
• "[Question 3]"

OBJECTION HANDLING:
Objection: "We're already using [competitor] and it's working"
Response: [Specific response]

Objection: "[Competitor] has more integrations"
Response: [Specific response]

DEAL SIGNALS (signs a prospect is evaluating this competitor):
• [Signal 1 — what they say or ask that indicates competitor consideration]
• [Signal 2]

WHEN TO WALK AWAY:
[Honest — scenarios where this competitor is actually the better choice for the prospect]

PROOF POINTS:
• [Specific OmnifiCX advantage — architecture, capability, or customer outcome]
```

**Special Veeqo Battlecard Note:**
Veeqo is FREE (Amazon-subsidized). Never compete on price here.
Win on: multi-ERP support, PIM capability, routing rules complexity,
non-Amazon channel depth, data ownership concerns (Amazon owns your data in Veeqo).

**Save each as:** `battlecard_[competitor_name].md`
**Save combined as:** `battlecards_all.md`

---

## TASK 9: SCENARIO SIMULATION (2026 Reality)

**GOAL:** Simulate competitive responses and market threats relevant to 2026

**SCENARIO A: OmnifiCX launches "flat $299/month, unlimited connectors"**
- Which competitors are price-threatened and how severely?
- Likely response from Celigo, Linnworks, Pipe17?
- How does Veeqo (free) affect this narrative?
- Counter-messaging competitors would deploy?
- Timeline: immediate / 3 months / 6 months

**SCENARIO B: OmnifiCX launches "No-Code Fulfillment Routing Rules" as hero feature**
- Which competitors already have fulfillment routing and how good is it?
- Who would copy fastest? (estimate based on company size and engineering velocity)
- Which competitor is most existentially threatened?
- What is OmnifiCX's defensibility window?

**SCENARIO C: Shopify expands Shopify Fulfillment Network into full OMS**
- This is the existential scenario — treat it seriously
- Which OmnifiCX competitors become redundant?
- What does OmnifiCX do that Shopify native cannot?
- How does multi-ERP, multi-channel (non-Shopify) positioning hold up?
- What OmnifiCX must build NOW to not be disrupted by Shopify

**SCENARIO D: OmnifiCX partners with NetSuite as preferred SMB integration layer**
- Which competitors have existing NetSuite relationships?
- How would Celigo (strong NetSuite partner) respond?
- Does this narrow or expand OmnifiCX's ICP?
- Revenue and distribution implications

**SCENARIO E: Well-funded competitor copies hub-and-spoke architecture**
- How long realistically? (Linnworks, Brightpearl, Cin7 — pick the most likely)
- What is OmnifiCX's durable moat if architecture is copied?
- What must be built NOW that takes 18+ months to copy?
- Data network effects — how to build them?

**SCENARIO F: AI agents replace middleware (2026 critical threat)**
- Multiple funded startups are using LangChain/AutoGen to build 
  "AI-generated custom integrations" without middleware platforms
- How does this affect OmnifiCX's no-code value proposition?
- Is OmnifiCX's moat the canonical data model (hard to replicate with AI) 
  or the UI (easy to replicate with AI)?
- What does OmnifiCX build to stay ahead of AI-native integration competitors?
- Which customer segments are most vulnerable to AI agent substitution?
- Which segments are SAFER (compliance, data integrity requirements)?

**For each scenario produce:**
- Most likely outcome with probability: High/Medium/Low
- OmnifiCX recommended pre-emptive move
- OmnifiCX recommended reactive move
- Risk rating: 1-5
- Time horizon: immediate/6 months/12 months/18+ months

**Save as:** `scenario_simulations.md`

---

## TASK 10: FINAL SYNTHESIS — STRATEGY BRIEF

**GOAL:** Produce an actionable strategy document and supporting artifacts for CEO and board

**INSTRUCTIONS FOR CLAUDE CODE:**
```
Using all outputs from Tasks 1-9, produce the following sections:

1. MARKET CATEGORY DEFINITION (half page)
   Critical question: Does OmnifiCX OCCUPY an existing category 
   or CREATE a new one?
   
   Option A — Occupy: "We are the best OMS for SMB ecommerce"
   (faster to explain, harder to own long-term)
   
   Option B — Create: "We are the Unified Commerce Operations Layer 
   for SMB ecommerce" (harder to explain, creates defensible category)
   
   Recommendation with rationale based on research findings.
   
   Include:
   - One sentence for SMB merchant (operational language)
   - One sentence for investor (market size + disruption language)
   - One sentence for analyst/press (category language)

2. COMPETITIVE LANDSCAPE MAP (1 page)
   - Tier 1: Direct architectural competitors (same category, same segment)
   - Tier 2: Adjacent threats (different architecture, overlapping jobs)
   - Tier 3: Platform-native threats (Shopify, Amazon) — rate as existential risk
   - Tier 4: Substitutes (agencies, DIY, spreadsheets)
   - Market trajectory: consolidation vs fragmentation over 24 months?

3. TOP 5 DIFFERENTIATION OPPORTUNITIES (1 page)
   Ranked by: SMB job importance × competitor weakness × OmnifiCX buildability
   For each:
   - Gap description with evidence
   - Recommended product response
   - Recommended positioning response
   - Timeline to capture

4. RECOMMENDED POSITIONING (1 page)
   - Category narrative (from section 1)
   - ICP definition refined from research
   - Key message by buyer:
     * Founder/CEO: [message]
     * Ops Manager: [message]
     * IT Lead: [message]
   - Proof points for each message
   - Narratives to explicitly AVOID (overcrowded)

5. PRICING RECOMMENDATION (half page)
   - Model and rationale
   - Entry, mid, growth tier structure
   - What limit to use as primary variable
   - How to position vs Veeqo free tier
   - What pricing traps to avoid from research

6. BUILD vs PARTNER vs ACQUIRE MAP (half page)
   NEW — This is the PM-to-CEO output
   For each gap identified in research:
   - Build it: [which gaps OmnifiCX should build natively]
   - Partner for it: [which gaps should be filled via partnerships]
   - Acquire for it: [which small competitors might be acquisition targets]
   Rationale for each recommendation

7. PARTNERSHIP STRATEGY (half page)
   - Top 3 ERP partnerships to pursue (ranked by SMB install base)
   - Top 2 3PL/fulfillment partnerships
   - App store strategy (Shopify priority, then BigCommerce)
   - Agency/SI channel play
   - What to avoid (partners that create lock-in risk)

8. 90-DAY GTM ACTION PLAN (half page)
   - Week 1-2: Positioning and messaging quick wins
   - Month 1: Product priorities from gap analysis
   - Month 2-3: Channel and partnership moves
   - Success metrics for each action

Save as: competitive_strategy_brief.md
Save as: executive_summary.md (pure 1-page — CEO reads this first)
Save as: board_deck_competitive_slide.md (bullet format for board presentation)
```

---

## OUTPUT FILE MANIFEST

| File | Task | Priority | Purpose |
|------|------|----------|---------|
| competitor_inventory.json | T1 | 🔴 Critical | Master data — all tasks depend on this |
| competitor_inventory.csv | T1 | 🔴 Critical | Spreadsheet version |
| architecture_matrix.csv | T2 | 🔴 Critical | Core differentiator evidence |
| architecture_differentiation.md | T2 | 🔴 Critical | OmnifiCX architectural proof points |
| jtbd_matrix.csv | T3 | 🔴 Critical | Product roadmap input |
| integration_job_gaps.md | T3 | 🔴 Critical | Top 8 underserved jobs |
| pricing_analysis.csv | T4 | 🟠 High | GTM input |
| pricing_recommendation.md | T4 | 🟠 High | Pricing strategy |
| review_data.csv | T5 | 🔴 Critical | Raw VOC data |
| voc_synthesis.md | T5 | 🔴 Critical | Messaging and positioning input |
| gtm_analysis.csv | T6 | 🟠 High | Channel map |
| channel_whitespace.md | T6 | 🟠 High | GTM opportunities |
| nocode_depth_analysis.csv | T7 | 🟠 High | Differentiator validation |
| nocode_differentiation.md | T7 | 🟠 High | Sales and marketing proof |
| battlecard_linnworks.md | T8 | 🔴 Critical | First battlecard — most common matchup |
| battlecard_celigo.md | T8 | 🔴 Critical | iPaaS matchup |
| battlecard_brightpearl.md | T8 | 🟠 High | OMS + ERP matchup |
| battlecard_pipe17.md | T8 | 🟠 High | Shopify-native matchup |
| battlecard_cin7.md | T8 | 🟠 High | Inventory + ERP matchup |
| battlecard_veeqo.md | T8 | 🔴 Critical | Free competitor — hardest to beat on price |
| battlecards_all.md | T8 | 🔴 Critical | Combined for sales team |
| scenario_simulations.md | T9 | 🟠 High | Strategic planning input |
| competitive_strategy_brief.md | T10 | 🔴 Critical | Full strategy |
| executive_summary.md | T10 | 🔴 Critical | CEO reads first |
| board_deck_competitive_slide.md | T10 | 🟠 High | Board presentation |

---

## HARD CONSTRAINTS FOR CLAUDE CODE

```
DATA INTEGRITY:
- Use web search for ALL competitor data — zero hallucination
- Record exact retrieval date on all data
- Mark any field as "data-unavailable" if not found — do not estimate
- Reviews must be real public quotes — never fabricated

EXCLUSIONS (do not research):
- TradeGecko/QuickBooks Commerce — shut down 2022
- Boomi — enterprise only, $500K+ contracts, wrong segment
- MuleSoft — enterprise only, Salesforce-owned, wrong segment
- Fabric OMS — enterprise only, wrong segment

VEEQO SPECIAL TREATMENT:
- It is free via Amazon — treat this as a major market disruption
- Research what SMBs do AFTER adopting Veeqo — what's still missing?
- Never recommend competing on price against Veeqo

ARCHITECTURE CLAIMS:
- Never accept "real-time" or "no-code" from marketing copy alone
- Require review evidence or technical documentation
- Rate evidence quality: Strong / Weak / Marketing-only

AI SCENARIO (Task 9, Scenario F):
- This is the most strategically important scenario for 2026
- Research actual AI-native integration startups emerging in 2025-2026
- Be specific about which OmnifiCX use cases are AI-replicable vs not
```

---

## EXECUTION PRIORITY IF RUNNING PARTIAL

```
MUST RUN (foundation):
1. Task 1 — Competitor Inventory
2. Task 5 — Review Mining (richest signal source)
3. Task 8 — Battlecards (immediate sales value)

SHOULD RUN (strategy):
4. Task 2 — Architecture Matrix (core differentiator)
5. Task 3 — JTBD Matrix (product decisions)
6. Task 4 — Pricing Analysis

RUN AFTER FOUNDATION:
7. Task 7 — No-Code Depth
8. Task 6 — GTM Analysis
9. Task 9 — Scenarios
10. Task 10 — Final Synthesis
```
